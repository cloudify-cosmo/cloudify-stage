import fs from 'fs-extra';
import pathlib from 'path';
import _ from 'lodash';
import ivm from 'isolated-vm';

import type { NextFunction, Request, Response } from 'express';

import { getConfig } from '../config';
import { ALLOWED_METHODS_ARRAY, ALLOWED_METHODS_OBJECT, WIDGET_ID_HEADER } from '../consts';
import { db } from '../db/Connection';
import { getResourcePath } from '../utils';
import * as services from './services';

import { getLogger } from './LoggerHandler';
import type { AllowedRequestMethod } from '../types';
import type { WidgetBackendsInstance } from '../db/models/WidgetBackendsModel';
import type { BackendServiceRegistrator } from './BackendHandler.types';
import { IncomingHttpHeaders } from 'http';


const logger = getLogger('WidgetBackend');

const builtInWidgetsFolder = getResourcePath('widgets', false);
const userWidgetsFolder = getResourcePath('widgets', true);
const getServiceString = (widgetId: string, method: AllowedRequestMethod, serviceName: string) =>
    `widget=${widgetId} method=${method} name=${serviceName}`;

const getPathCompatibleWithUnix = (path: string) => {
    const windowsPathSeparator = pathlib.win32.sep;
    const unixPathSeparator = pathlib.posix.sep;
    if (path.includes(windowsPathSeparator)) {
        return path.replaceAll(windowsPathSeparator, unixPathSeparator);
    }
    return path;
};

const BackendRegistrator = (
    widgetId: string,
    resolve: (value?: any) => void,
    reject: (reason?: any) => void
): BackendServiceRegistrator => ({
    register: (serviceName, method, service) => {
        if (!serviceName) {
            return reject('Service name must be provided');
        }
        if(!hasExecuteFunctionWithAwait(service as string)) {
            return reject(`Error registering service: ${service}.
            Expected format:
            async function execute(query, reqHeaders=optional) {
                ....code to execute....
                await helperFunction e.g., DoGet
            }`);
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

        logger.info(`--- registering service ${getServiceString(widgetId, normalizedMethod, normalizedServiceName)}`);

        return db.WidgetBackends.findOrCreate<WidgetBackendsInstance>({
            where: {
                widgetId,
                serviceName: normalizedServiceName,
                method: normalizedMethod
            },
            defaults: {
                widgetId,
                serviceName: normalizedServiceName,
                method: normalizedMethod
            }
        })
            .then(([widgetBackend]) => {
                logger.debug(
                    `--- updating entry for service: ${getServiceString(
                        widgetId,
                        normalizedMethod,
                        normalizedServiceName
                    )}`
                );
                return widgetBackend.update(
                    {
                        script: normalizedService!.toString()
                    },
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
            });
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

function hasExecuteFunctionWithAwait (script: string) {
    // Regular expression pattern to match the desired function definition with "await" keyword
    const pattern = /^async\s+function\s+execute\s*\([^)]*\)\s*{[\s\S]*\bawait\b/;
    return pattern.test(script as string);
} 

/** host wrapper function  to register the script, service and method in the db using BackendRegistrator */
function registerHostFunction(widgetId: string, serviceName: string, method: AllowedRequestMethod, service: string) {
    return new Promise((resolve, reject) => {
        BackendRegistrator(widgetId, resolve, reject).register(serviceName, method, service); 
    }).catch(error=> {
        return Promise.reject(error);
    })
}

export function importWidgetBackend(widgetId: string, isCustom = true) {
    let widgetsFolder = userWidgetsFolder;
    if (!isCustom) {
        widgetsFolder = builtInWidgetsFolder;
    }
    const backendFile = pathlib.resolve(widgetsFolder, widgetId, getConfig().app.widgets.backendFilename);

    async function importWidgetBackendFromFile(extensions: string[]): Promise<any> {
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
            /**  read the file content of the uploaded script file
             call the host function through synced function from isolated vm */
            const backendPath = getPathCompatibleWithUnix(backendFileWithExtension);
            // TODO: temp fix to skip the executions/backend.ts until moved to stage-backend
                if (!backendFileWithExtension.includes('executions')) {
                    const fileContent = fs.readFileSync(backendPath, 'utf8');
                    const isolate = new ivm.Isolate();
                    const context = isolate.createContextSync();
                    const sandbox = context.global;
                    return new Promise((resolve, reject)=>{
                    /* Set sync the register function passed in custom script file to map to the function in host, i.e registerHostFunction
                      do not directly call not host function in host context, call it with setSync in isolated-vm */
                    sandbox.setSync(
                        'register',
                        function (serviceName: string, method: AllowedRequestMethod, execute: string): any {
                            registerHostFunction(widgetId, serviceName, method, execute).then(resolve).catch(reject)
                    });
                    const complieScript = isolate.compileScriptSync(fileContent);
                    complieScript.runSync(context);
             }).catch((error)=>{
                    return Promise.reject(error)
             });
            }
        } catch (err: any) {
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

const runScriptInIsolate = async function (script: string, query: qs.ParsedQs, headers: IncomingHttpHeaders) {
    const isolate = new ivm.Isolate();
    const context = isolate.createContextSync();
    const sandbox = context.global;

    // Utility function
    services.Sandbox.methodsList.forEach((method: string) => {
        sandbox.setSync(method, services.Sandbox[method as keyof typeof services.Sandbox], { reference: true });
    });

    sandbox.setSync('logger', (method: 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly' | 'log', msg = '') => {
        logger[method as keyof typeof logger](`${msg}`);
    });

    const compiledScript = await isolate.compileScript(script);
    await compiledScript.run(context);
    const executeFn = await context.global.get('execute', {
        reference: true
    });
    const result = await executeFn.apply(undefined, [query, headers], {
        arguments: { copy: true },
        result: { promise: true, copy: true }
    });
    return result as string; // The sandbox returns the stringified result
};

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

    return db.WidgetBackends.findOne<WidgetBackendsInstance>({
        where: { widgetId, serviceName: normalizedServiceName, method: normalizedMethod }
    })
        .catch(() => {
            return Promise.reject(
                `There is no service ${normalizedServiceName} for method ${normalizedMethod} for widget ${widgetId} registered`
            );
        })
        .then(async widgetBackend => {
            let script = _.get(widgetBackend, 'script', null);
            if (script) {
                const { headers, query } = req;
                const scriptResult = await runScriptInIsolate(script, query, headers);
                try {
                    const data = JSON.parse(scriptResult);
                    res.send(data);
                } catch {
                    next;
                }
            }
            return Promise.reject(
                `No script for service ${normalizedServiceName} for method ${normalizedMethod} for widget ${widgetId}`
            );
        });
}

export function removeWidgetBackend(widgetId: string) {
    return db.WidgetBackends.destroy<WidgetBackendsInstance>({ where: { widgetId } }).then(() =>
        logger.debug(`Deleted widget backend for ${widgetId}.`)
    );
}
