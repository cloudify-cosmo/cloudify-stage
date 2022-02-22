import fs from 'fs-extra';
import pathlib from 'path';
import _ from 'lodash';
import { NodeVM, VMScript } from 'vm2';
import ts, { ModuleKind, ScriptTarget } from 'typescript';
import tsConfig from '@tsconfig/node14/tsconfig.json';

import type { Request, Response, NextFunction } from 'express';
import type { CompilerOptions } from 'typescript';

import { getConfig } from '../config';
import { ALLOWED_METHODS_OBJECT, ALLOWED_METHODS_ARRAY, WIDGET_ID_HEADER } from '../consts';
import { db } from '../db/Connection';
import { getResourcePath } from '../utils';
import * as services from './services';

import { getLogger } from './LoggerHandler';
import type { AllowedRequestMethod } from '../types';

const logger = getLogger('WidgetBackend');

const builtInWidgetsFolder = getResourcePath('widgets', false);
const userWidgetsFolder = getResourcePath('widgets', true);
const getServiceString = (widgetId: string, method: AllowedRequestMethod, serviceName: string) =>
    `widget=${widgetId} method=${method} name=${serviceName}`;
const allowedModulesPaths = _.map(
    getConfig().app.widgets.allowedModules,
    module => `${process.cwd()}/node_modules/${module}`
);

// NOTE: TS configurations from @tsconfig are not compatible with CompilerOptions type
// used in ts.transpile method's second argument type)
const compilerOptions: CompilerOptions = {
    ...tsConfig.compilerOptions,
    module: ModuleKind.CommonJS,
    target: ScriptTarget.ES2020
};

type BackendService = (req: Request, res: Response, next: NextFunction, helper: typeof services) => void;
const BackendRegistrator = (widgetId: string, resolve: (value?: any) => void, reject: (reason?: any) => void) => ({
    register: (serviceName: string, method: AllowedRequestMethod | BackendService, service?: BackendService) => {
        if (!serviceName) {
            return reject('Service name must be provided');
        }

        const normalizedServiceName = _.toUpper(serviceName);
        let normalizedMethod: AllowedRequestMethod = ALLOWED_METHODS_OBJECT.get;
        let normalizedService = service;
        if (typeof method !== 'string') {
            normalizedService = method;
            normalizedMethod = ALLOWED_METHODS_OBJECT.get;
        } else if (_.includes(ALLOWED_METHODS_ARRAY, method.toUpperCase())) {
            normalizedMethod = method.toUpperCase() as AllowedRequestMethod;
        } else {
            return reject(`Method '${method}' not allowed. Valid methods: ${ALLOWED_METHODS_ARRAY.toString()}`);
        }

        if (!normalizedService) {
            return reject('Service body must be provided');
        }
        if (!_.isFunction(normalizedService)) {
            return reject('Service body must be a function (function(request, response, next, helper) {...})');
        }

        logger.info(`--- registering service ${getServiceString(widgetId, normalizedMethod, normalizedServiceName)}`);

        return (
            db.WidgetBackends.findOrCreate({
                where: {
                    widgetId,
                    serviceName: normalizedServiceName,
                    method: normalizedMethod
                },
                defaults: {
                    script: ''
                }
            })
                // @ts-ignore TODO(RD-3119) Update typings when types for WidgetBackends model are ready
                .then(([widgetBackend]) => {
                    logger.debug(
                        `--- updating entry for service: ${getServiceString(
                            widgetId,
                            normalizedMethod,
                            normalizedServiceName
                        )}`
                    );
                    return widgetBackend.update(
                        { script: new VMScript(`module.exports = ${normalizedService!.toString()}`) },
                        { fields: ['script'] }
                    );
                })
                .then(() => {
                    logger.info(
                        `--- registered service: ${getServiceString(widgetId, normalizedMethod, normalizedServiceName)}`
                    );
                    return resolve();
                })
                .catch((error: Error) => {
                    logger.error(error);
                    return reject(
                        `--- error registering service: ${getServiceString(
                            widgetId,
                            normalizedMethod,
                            normalizedServiceName
                        )}`
                    );
                })
        );
    }
});
/* eslint-enable no-param-reassign */

function getUserWidgets() {
    return fs
        .readdirSync(userWidgetsFolder)
        .filter(
            dir =>
                fs.lstatSync(pathlib.resolve(userWidgetsFolder, dir)).isDirectory() &&
                _.indexOf(getConfig().app.widgets.ignoreFolders, dir) < 0
        );
}

function getBuiltInWidgets() {
    return fs
        .readdirSync(builtInWidgetsFolder)
        .filter(
            dir =>
                fs.lstatSync(pathlib.resolve(builtInWidgetsFolder, dir)).isDirectory() &&
                _.indexOf(getConfig().app.widgets.ignoreFolders, dir) < 0
        );
}

export function importWidgetBackend(widgetId: string, isCustom = true) {
    let widgetsFolder = userWidgetsFolder;
    if (!isCustom) {
        widgetsFolder = builtInWidgetsFolder;
    }
    const backendFile = pathlib.resolve(widgetsFolder, widgetId, getConfig().app.widgets.backendFilename);

    function importWidgetBackendFromFile(extensions: string[]): Promise<any> {
        if (extensions.length === 0) {
            return Promise.resolve();
        }

        const extension = extensions.pop();

        const backendFileWithExtension = `${backendFile}.${extension}`;
        if (!fs.existsSync(backendFileWithExtension)) {
            return importWidgetBackendFromFile(extensions);
        }

        logger.info(`-- initializing file ${backendFileWithExtension}`);

        try {
            const vm = new NodeVM({
                sandbox: {
                    _,
                    widgetId,
                    BackendRegistrator
                },
                require: {
                    context: 'sandbox',
                    external: true,
                    root: [backendFileWithExtension, ...allowedModulesPaths]
                },
                compiler: source => ts.transpile(source, compilerOptions),
                sourceExtensions: getConfig().app.widgets.backendFilenameExtensions
            });

            const script = `
                    import backend from '${backendFileWithExtension.replace('\\', '\\\\')}';
                    module.exports = new Promise((resolve, reject) => {
                         try {
                             if (_.isFunction(backend)) {
                                 backend(BackendRegistrator(widgetId, resolve, reject));
                             } else {
                                 reject('Backend definition must be a function (module.exports = function(BackendRegistrator) {...})');
                             }
                         } catch (error) {
                             reject(error);
                         }
                     });`;

            return vm.run(script, { filename: pathlib.resolve(`${process.cwd()}/${widgetId}`) });
        } catch (err) {
            logger.error('reject', backendFileWithExtension, err);
            return Promise.reject(
                `Error during importing widget backend from file ${backendFileWithExtension} - ${err.message}`
            );
        }
    }

    return importWidgetBackendFromFile([...getConfig().app.widgets.backendFilenameExtensions]);
}

export function initWidgetBackends() {
    logger.info('Scanning widget backend files...');

    const userWidgets = getUserWidgets();
    const builtInWidgets = getBuiltInWidgets();

    const promises: Promise<any>[] = [];
    _.each(userWidgets, widgetId =>
        promises.push(new Promise((resolve, reject) => importWidgetBackend(widgetId).then(resolve).catch(reject)))
    );
    _.each(builtInWidgets, widgetId =>
        promises.push(
            new Promise((resolve, reject) => importWidgetBackend(widgetId, false).then(resolve).catch(reject))
        )
    );

    return Promise.all(promises)
        .then(() => {
            logger.info('Widget backend files for registration completed');
            return Promise.resolve();
        })
        .catch(error => {
            logger.error('Widget backend files registration cannot be completed');
            return Promise.reject(error);
        });
}

export function callService(
    serviceName: string,
    method: AllowedRequestMethod,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const widgetId = req.header(WIDGET_ID_HEADER);
    const normalizedMethod = _.toUpper(method) as AllowedRequestMethod;
    const normalizedServiceName = _.toUpper(serviceName);

    return (
        db.WidgetBackends.findOne({ where: { widgetId, serviceName: normalizedServiceName, method: normalizedMethod } })
            .catch(() => {
                return Promise.reject(
                    `There is no service ${normalizedServiceName} for method ${normalizedMethod} for widget ${widgetId} registered`
                );
            })
            // @ts-ignore TODO(RD-3119) Update typings when types for WidgetBackends model are ready
            .then(widgetBackend => {
                const script = _.get(widgetBackend, 'script.code', null);

                if (script) {
                    const vm = new NodeVM({
                        require: {
                            external: true,
                            root: allowedModulesPaths
                        }
                    });
                    return vm.run(script, { filename: pathlib.resolve(`${process.cwd()}/${widgetId}`) })(
                        req,
                        res,
                        next,
                        services
                    );
                }
                return Promise.reject(
                    `No script for service ${normalizedServiceName} for method ${normalizedMethod} for widget ${widgetId}`
                );
            })
    );
}

export function removeWidgetBackend(widgetId: string) {
    return db.WidgetBackends.destroy({ where: { widgetId } }).then(() =>
        logger.debug(`Deleted widget backend for ${widgetId}.`)
    );
}
