'use strict';
/**
 * Created by pposel on 13/09/2017.
 */

var os = require('os');
var db = require('../db/Connection');
var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');

var logger = require('log4js').getLogger('WidgetBackend');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var widgetsFolder = '../widgets';
if (!fs.existsSync(widgetsFolder)) {
    widgetsFolder = '../dist/widgets';
}

var services = {};
var BackendRegistrator = function (widgetName) {
    return {
        register: (serviceName, service) => {
            if (!serviceName) {
                throw new Error('Service name must be provided');
            }
            if (!service) {
                throw new Error('Service body must be provided');
            } else if (!_.isFunction(service)) {
                throw new Error('Service body must be a function (function(request, response, next, Service) {...})');
            }

            if (_.isObject(services[widgetName]) && !_.isNil(services[widgetName][serviceName])) {
                throw new Error('Service ' + serviceName + ' for widget ' + widgetName + ' already exists');
            } else {
                if (_.isEmpty(services[widgetName]))
                    services[widgetName] = {};
                logger.info('--- registering service ' + serviceName);
                services[widgetName][serviceName] = service;
            }
        }
    }
}

var ServiceHelper = {
    callManager: (method, url, req) => {
        return ManagerHandler.jsonRequest(method, url, req.headers);
    },
    db: {
        create: (key, value, req, res, next) => {
            if (_.isEmpty(req.user)) {
                res.status(401).send({message: 'User not authenticated'});
            } else {
                return db.WidgetsData
                    .create({
                        user: req.user.username,
                        widget: req.header(config.app.widgets.widgetNameHeader),
                        key: key,
                        value: value
                    })
                    .catch(function () {
                        res.status(500).send({message: 'Data write error'});
                    });
            }
        },
        read: (key, req, res, next) => {
            if (_.isEmpty(req.user)) {
                res.status(401).send({message: 'User not authenticated'});
            } else {
                return db.WidgetsData
                    .findOne({
                        where: {
                            user: req.user.username,
                            widget: req.header(config.app.widgets.widgetNameHeader),
                            key: key,
                        }
                    }).catch(function () {
                        res.status(500).send({message: 'Data read error'});
                    });
            }
        },
        update: (key, value, req, res, next) => {
            if (_.isEmpty(req.user)) {
                res.status(401).send({message: 'User not authenticated'});
            } else {
                return db.WidgetsData
                    .update({
                        value: value
                    },
                    {
                        where: {
                            user: req.user.username,
                            widget: req.header(config.app.widgets.widgetNameHeader),
                            key: key
                        }
                    }).catch(function () {
                        res.status(500).send({message: 'Data update error'});
                    });
            }
        },
        delete: (key, req, res, next) => {
            if (_.isEmpty(req.user)) {
                res.status(401).send({message: 'User not authenticated'});
            } else {
                return db.WidgetsData
                    .destroy({
                        where: {
                            user: req.user.username,
                            widget: req.header(config.app.widgets.widgetNameHeader),
                            key: key,
                        }
                    }).catch(function () {
                        res.status(500).send({message: 'Data delete error'});
                    });
            }
        }
    },
}

module.exports = (function() {

    function _getInstalledWidgets() {
        return fs.readdirSync(pathlib.resolve(widgetsFolder))
            .filter(dir => fs.lstatSync(pathlib.resolve(widgetsFolder, dir)).isDirectory()
            && _.indexOf(config.app.widgets.ignoreFolders, dir) < 0);
    }

    function importWidgetBackend(widgetName) {
        var backendFile = pathlib.resolve(widgetsFolder, widgetName, config.app.widgets.backendFilename);
        if (fs.existsSync(backendFile)) {
            logger.info('-- initializing file ' + backendFile);

            try {
                var backend = require(backendFile);
                if (_.isFunction(backend)) {
                    backend(BackendRegistrator(widgetName));
                } else {
                    throw new Error('Backend definition must be a function (module.exports = function(BackendRegistrator) {...})');
                }
            } catch(err) {
                throw new Error('Error during importing widget backend from file ' + backendFile + ' - ' + err.message);
            }
        }
    }

    function initWidgetBackends() {
        logger.info('Scanning widget backend files...');

        var widgets = _getInstalledWidgets();

        _.each(widgets, widgetName => importWidgetBackend(widgetName));

        logger.info('Widget backend files for registration completed');
    }

    function callService(serviceName, req, res, next) {
        var widgetName = req.header('widgetName');
        var widgetServices = services[widgetName];
        if (widgetServices) {
            var service = widgetServices[serviceName];
            if (service) {
                return service(req, res, next, ServiceHelper);
            } else {
                throw new Error('Widget ' + widgetName + ' has no services registered');
            }
        } else {
            throw new Error('Service name ' + serviceName + ' does not exist for widget ' + widgetName);
        }

    }

    return {
        importWidgetBackend,
        initWidgetBackends,
        callService
    }
})();
