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
                throw new Error('Service body must be a function (function(request, response, Service) {...})');
            }

            if (services[serviceName]) {
                throw new Error('Service ' + serviceName + ' already exists');
            } else {
                if (_.isEmpty(services[widgetName]))
                    services[widgetName] = {};
                services[widgetName][serviceName] = service;
            }
        }
    }
}

var ServiceHelper = {
    callManager: (method, url, req) => {
        return ManagerHandler.jsonRequest(method, url, req.headers);
    }
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

        logger.info('Widget backend files registration completed - ' + _.keys(services));
    }

    function callService(serviceName, req, res, next) {
        var service = services[req.header('widgetName')][serviceName];
        if (service) {
            return service(req, res, next, ServiceHelper);
        } else {
            throw new Error('Service name ' + serviceName + ' does not exist');
        }
    }

    return {
        importWidgetBackend,
        initWidgetBackends,
        callService
    }
})();
