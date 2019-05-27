'use strict';
/**
 * Created by pposel on 13/09/2017.
 */

const fs = require('fs-extra');
const pathlib = require('path');
const _ = require('lodash');
const {NodeVM, VMScript} = require('vm2');

const config = require('../config').get();
const consts = require('../consts');
const db = require('../db/Connection');
const Utils = require('../utils');

const logger = require('./LoggerHandler').getLogger('WidgetBackend');

const builtInWidgetsFolder = Utils.getResourcePath('widgets', false);
const userWidgetsFolder = Utils.getResourcePath('widgets', true);

var BackendRegistrator = function (widgetId, resolve, reject) {
    return {
        register: (serviceName, method, service) => {
            if (!serviceName) {
                return reject('Service name must be provided');
            } else {
                serviceName = _.toUpper(serviceName);
            }

            if (!_.isString(method)) {
                service = method;
                method = consts.ALLOWED_METHODS_OBJECT.get;
            } else if (!_.isNil(method)) {
                method = _.toUpper(method);
                if (!_.includes(consts.ALLOWED_METHODS_ARRAY, method)) {
                    return reject(`Method '${method}' not allowed. Valid methods: ${consts.ALLOWED_METHODS_ARRAY.toString()}`);
                }
            }

            if (!service) {
                return reject('Service body must be provided');
            } else if (!_.isFunction(service)) {
                return reject('Service body must be a function (function(request, response, next, helper) {...})');
            }

            const getServiceString = (widgetId, method, serviceName) => `widget=${widgetId} method=${method} name=${serviceName}`;
            logger.info('--- registering service ' + getServiceString(widgetId, method, serviceName));

            return db.WidgetBackend
                .findOrCreate({
                    where: {
                        widgetId: widgetId,
                        serviceName: serviceName,
                        method: method
                    },
                    defaults: {
                        script: ''
                    }})
                .spread((widgetBackend, created) => {
                    if (!created) {
                        logger.debug('--- updating entry for service: ' + getServiceString(widgetId, method, serviceName));
                        return widgetBackend.update(
                            { script: new VMScript('module.exports = ' + service.toString()) },
                            { fields: ['script'] }
                        )
                    } else {
                        logger.debug('--- created entry for service: ' + getServiceString(widgetId, method, serviceName));
                    }
                })
                .then(() => {
                    logger.info('--- registered service: ' + getServiceString(widgetId, method, serviceName));
                    return resolve();
                })
                .catch((error) => {
                    logger.error(error);
                    return reject('--- error registering service: ' + getServiceString(widgetId, method, serviceName));
                });
        }
    }
}

module.exports = (function() {

    function _getUserWidgets() {
        return fs.readdirSync(userWidgetsFolder)
            .filter(dir => fs.lstatSync(pathlib.resolve(userWidgetsFolder, dir)).isDirectory()
            && _.indexOf(config.app.widgets.ignoreFolders, dir) < 0);
    }

    function _getBuiltInWidgets() {
        return fs.readdirSync(builtInWidgetsFolder)
            .filter(dir => fs.lstatSync(pathlib.resolve(builtInWidgetsFolder, dir)).isDirectory()
                && _.indexOf(config.app.widgets.ignoreFolders, dir) < 0);
    }

    function importWidgetBackend(widgetId, isCustom=true) {
        var widgetsFolder = userWidgetsFolder;
        if (!isCustom) {
            widgetsFolder = builtInWidgetsFolder;
        }
        var backendFile = pathlib.resolve(widgetsFolder, widgetId, config.app.widgets.backendFilename);

        if (fs.existsSync(backendFile)) {
            logger.info('-- initializing file ' + backendFile);

            try {
                var vm = new NodeVM({
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

                var script =
                    `module.exports = new Promise((resolve, reject) => {
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

                return vm.run(script, pathlib.resolve(process.cwd() + '/' + widgetId));

            } catch(err) {
                logger.info('reject', backendFile);
                return Promise.reject('Error during importing widget backend from file ' + backendFile + ' - ' + err.message);
            }
        } else {
            return Promise.resolve();
        }
    }

    function initWidgetBackends() {
        logger.info('Scanning widget backend files...');

        var userWidgets = _getUserWidgets();
        var builtInWidgets = _getBuiltInWidgets();

        let promises = [];
        _.each(userWidgets, widgetId => promises.push(
            new Promise((resolve, reject) => importWidgetBackend(widgetId).then(resolve).catch(reject))));
        _.each(builtInWidgets, widgetId => promises.push(
            new Promise((resolve, reject) => importWidgetBackend(widgetId, false).then(resolve).catch(reject))));

        return Promise.all(promises)
            .then(() => {
                logger.info('Widget backend files for registration completed');
                return Promise.resolve();
            })
            .catch((error) => {
                logger.error('Widget backend files registration cannot be completed');
                return Promise.reject(error);
            });
    }

    function callService(serviceName, method, req, res, next) {
        var widgetId = req.header(consts.WIDGET_ID_HEADER);
        method = _.toUpper(method);
        serviceName = _.toUpper(serviceName);

        return db.WidgetBackend
            .findOne({ where: { widgetId: widgetId, serviceName: serviceName, method: method } })
            .catch(() => {
                return Promise.reject('There is no service ' + serviceName + ' for method ' + method + ' for widget ' + widgetId + ' registered');
            })
            .then(widgetBackend => {
                const script = _.get(widgetBackend, 'script.code', null);

                if (script) {
                    var helper = require('./services');

                    var vm = new NodeVM({
                        require: {
                            external: config.app.widgets.allowedModules
                        }
                    });
                    return vm.run(script, pathlib.resolve(process.cwd() + '/' + widgetId))(req, res, next, helper);
                } else {
                    return Promise.reject('No script for service ' + serviceName + ' for method ' + method + ' for widget ' + widgetId);
                }
            });
    }

    function removeWidgetBackend(widgetId) {

        return db.WidgetBackend
            .destroy({ where: {widgetId: widgetId} })
            .then(() => logger.debug(`Deleted widget backend for ${widgetId}.`));
    }

    return {
        importWidgetBackend,
        initWidgetBackends,
        removeWidgetBackend,
        callService
    }
})();
