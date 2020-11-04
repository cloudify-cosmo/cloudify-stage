/**
 * Created by pposel on 13/09/2017.
 */

const fs = require('fs-extra');
const pathlib = require('path');
const _ = require('lodash');
const { NodeVM, VMScript } = require('vm2');

const config = require('../config').get();
const consts = require('../consts');
const { db } = require('../db/Connection');
const Utils = require('../utils');
const helper = require('./services');

const logger = require('./LoggerHandler').getLogger('WidgetBackend');

const builtInWidgetsFolder = Utils.getResourcePath('widgets', false);
const userWidgetsFolder = Utils.getResourcePath('widgets', true);
const getServiceString = (widgetId, method, serviceName) => `widget=${widgetId} method=${method} name=${serviceName}`;

/* eslint-disable no-param-reassign */
const BackendRegistrator = (widgetId, resolve, reject) => ({
    register: (serviceName, method, service) => {
        if (!serviceName) {
            return reject('Service name must be provided');
        }
        serviceName = _.toUpper(serviceName);

        if (!_.isString(method)) {
            service = method;
            method = consts.ALLOWED_METHODS_OBJECT.get;
        } else if (!_.isNil(method)) {
            method = _.toUpper(method);
            if (!_.includes(consts.ALLOWED_METHODS_ARRAY, method)) {
                return reject(
                    `Method '${method}' not allowed. Valid methods: ${consts.ALLOWED_METHODS_ARRAY.toString()}`
                );
            }
        }

        if (!service) {
            return reject('Service body must be provided');
        }
        if (!_.isFunction(service)) {
            return reject('Service body must be a function (function(request, response, next, helper) {...})');
        }

        logger.info(`--- registering service ${getServiceString(widgetId, method, serviceName)}`);

        return db.WidgetBackend.findOrCreate({
            where: {
                widgetId,
                serviceName,
                method
            },
            defaults: {
                script: ''
            }
        })
            .spread(widgetBackend => {
                logger.debug(`--- updating entry for service: ${getServiceString(widgetId, method, serviceName)}`);
                return widgetBackend.update(
                    { script: new VMScript(`module.exports = ${service.toString()}`) },
                    { fields: ['script'] }
                );
            })
            .then(() => {
                logger.info(`--- registered service: ${getServiceString(widgetId, method, serviceName)}`);
                return resolve();
            })
            .catch(error => {
                logger.error(error);
                return reject(`--- error registering service: ${getServiceString(widgetId, method, serviceName)}`);
            });
    }
});
/* eslint-enable no-param-reassign */

module.exports = (() => {
    function getUserWidgets() {
        return fs
            .readdirSync(userWidgetsFolder)
            .filter(
                dir =>
                    fs.lstatSync(pathlib.resolve(userWidgetsFolder, dir)).isDirectory() &&
                    _.indexOf(config.app.widgets.ignoreFolders, dir) < 0
            );
    }

    function getBuiltInWidgets() {
        return fs
            .readdirSync(builtInWidgetsFolder)
            .filter(
                dir =>
                    fs.lstatSync(pathlib.resolve(builtInWidgetsFolder, dir)).isDirectory() &&
                    _.indexOf(config.app.widgets.ignoreFolders, dir) < 0
            );
    }

    function importWidgetBackend(widgetId, isCustom = true) {
        let widgetsFolder = userWidgetsFolder;
        if (!isCustom) {
            widgetsFolder = builtInWidgetsFolder;
        }
        const backendFile = pathlib.resolve(widgetsFolder, widgetId, config.app.widgets.backendFilename);

        if (fs.existsSync(backendFile)) {
            logger.info(`-- initializing file ${backendFile}`);

            try {
                const vm = new NodeVM({
                    sandbox: {
                        _,
                        backendFile,
                        widgetId,
                        BackendRegistrator
                    },
                    require: {
                        context: 'sandbox',
                        external: config.app.widgets.allowedModules
                    }
                });

                const script = `module.exports = new Promise((resolve, reject) => {
                         try {
                             let backend = require(backendFile);
                             if (_.isFunction(backend)) {
                                 backend(BackendRegistrator(widgetId, resolve, reject));
                             } else {
                                 reject('Backend definition must be a function (module.exports = function(BackendRegistrator) {...})');
                             }
                         } catch (error) {
                             reject(error);
                         }
                     });`;

                return vm.run(script, pathlib.resolve(`${process.cwd()}/${widgetId}`));
            } catch (err) {
                logger.info('reject', backendFile);
                return Promise.reject(
                    `Error during importing widget backend from file ${backendFile} - ${err.message}`
                );
            }
        } else {
            return Promise.resolve();
        }
    }

    function initWidgetBackends() {
        logger.info('Scanning widget backend files...');

        const userWidgets = getUserWidgets();
        const builtInWidgets = getBuiltInWidgets();

        const promises = [];
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

    /* eslint-disable no-param-reassign */
    function callService(serviceName, method, req, res, next) {
        const widgetId = req.header(consts.WIDGET_ID_HEADER);
        method = _.toUpper(method);
        serviceName = _.toUpper(serviceName);

        return db.WidgetBackend.findOne({ where: { widgetId, serviceName, method } })
            .catch(() => {
                return Promise.reject(
                    `There is no service ${serviceName} for method ${method} for widget ${widgetId} registered`
                );
            })
            .then(widgetBackend => {
                const script = _.get(widgetBackend, 'script.code', null);

                if (script) {
                    const vm = new NodeVM({
                        require: {
                            external: config.app.widgets.allowedModules
                        }
                    });
                    return vm.run(script, pathlib.resolve(`${process.cwd()}/${widgetId}`))(req, res, next, helper);
                }
                return Promise.reject(
                    `No script for service ${serviceName} for method ${method} for widget ${widgetId}`
                );
            });
    }
    /* eslint-enable no-param-reassign */

    function removeWidgetBackend(widgetId) {
        return db.WidgetBackend.destroy({ where: { widgetId } }).then(() =>
            logger.debug(`Deleted widget backend for ${widgetId}.`)
        );
    }

    return {
        importWidgetBackend,
        initWidgetBackends,
        removeWidgetBackend,
        callService
    };
})();
