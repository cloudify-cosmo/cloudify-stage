'use strict';
/**
 * Created by pposel on 13/09/2017.
 */

var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var consts = require('../consts');

var logger = require('log4js').getLogger('WidgetBackend');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var widgetsFolder = '../widgets';
if (!fs.existsSync(widgetsFolder)) {
    widgetsFolder = '../dist/widgets';
}

var services = {};
var BackendRegistrator = function (widgetId) {
    return {
        register: (serviceName, service) => {
            if (!serviceName) {
                throw new Error('Service name must be provided');
            }
            if (!service) {
                throw new Error('Service body must be provided');
            } else if (!_.isFunction(service)) {
                throw new Error('Service body must be a function (function(request, response, next, helper) {...})');
            }

            if (_.isObject(services[widgetId]) && !_.isNil(services[widgetId][serviceName])) {
                throw new Error('Service ' + serviceName + ' for widget ' + widgetId + ' already exists');
            } else {
                if (_.isEmpty(services[widgetId]))
                    services[widgetId] = {};
                logger.info('--- registering service ' + serviceName);
                services[widgetId][serviceName] = service;
            }
        }
    }
}

module.exports = (function() {

    function _getInstalledWidgets() {
        return fs.readdirSync(pathlib.resolve(widgetsFolder))
            .filter(dir => fs.lstatSync(pathlib.resolve(widgetsFolder, dir)).isDirectory()
            && _.indexOf(config.app.widgets.ignoreFolders, dir) < 0);
    }

    function importWidgetBackend(widgetId) {
        var backendFile = pathlib.resolve(widgetsFolder, widgetId, config.app.widgets.backendFilename);
        if (fs.existsSync(backendFile)) {
            logger.info('-- initializing file ' + backendFile);

            try {
                var backend = require(backendFile);
                if (_.isFunction(backend)) {
                    backend(BackendRegistrator(widgetId));
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

        _.each(widgets, widgetId => importWidgetBackend(widgetId));

        logger.info('Widget backend files for registration completed');
    }

    function callService(serviceName, req, res, next) {
        var widgetId = req.header(consts.WIDGET_ID_HEADER);
        var widgetServices = services[widgetId];
        if (widgetServices) {
            var service = widgetServices[serviceName];
            if (service) {
                var helperServices = require('./services');
                return service(req, res, next, helperServices);
            } else {
                throw new Error('Widget ' + widgetId + ' has no services registered');
            }
        } else {
            throw new Error('Service name ' + serviceName + ' does not exist for widget ' + widgetId);
        }

    }

    return {
        importWidgetBackend,
        initWidgetBackends,
        callService
    }
})();
