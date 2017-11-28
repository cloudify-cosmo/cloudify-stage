'use strict';
/**
 * Created by pposel on 13/09/2017.
 */

var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var consts = require('../consts');
const {NodeVM, VMScript} = require('vm2');

var logger = require('log4js').getLogger('WidgetBackend');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var widgetsFolder = '../widgets';
if (!fs.existsSync(widgetsFolder)) {
    widgetsFolder = '../dist/widgets';
}

var services = {};
var BackendRegistrator = function (widgetId) {
    return {
        register: (serviceName, method, service) => {
            if (!serviceName) {
                throw new Error('Service name must be provided');
            } else {
                serviceName = _.toUpper(serviceName);
            }

            if (!_.isString(method)) {
                service = method;
                method = consts.ALLOWED_METHODS_OBJECT.get;
            } else if (!_.isNil(method)) {
                method = _.toUpper(method);
                if (!_.includes(consts.ALLOWED_METHODS_ARRAY, method)) {
                    throw new Error(`Method '${method}' not allowed. Valid methods: ${consts.ALLOWED_METHODS_ARRAY.toString()}`);
                }
            }

            if (!service) {
                throw new Error('Service body must be provided');
            } else if (!_.isFunction(service)) {
                throw new Error('Service body must be a function (function(request, response, next, helper) {...})');
            }

            if (!_.isUndefined(_.get(services, [widgetId, serviceName, method]))) {
                throw new Error('Service ' + serviceName + ' for method ' + method + ' for widget ' + widgetId + ' already exists');
            } else {
                if (_.isEmpty(services[widgetId]))
                    services[widgetId] = {};

                if (_.isEmpty(services[widgetId][serviceName]))
                    services[widgetId][serviceName] = {};

                logger.info('--- registering service ' + serviceName + ' for ' + method + ' method');
                services[widgetId][serviceName][method] = new VMScript('module.exports = ' + service.toString());
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

                var script = `var backend = require(backendFile);
                    if (_.isFunction(backend)) {
                        backend(BackendRegistrator(widgetId));
                    } else {
                        throw new Error('Backend definition must be a function (module.exports = function(BackendRegistrator) {...})');
                    }`;

                return vm.run(script, pathlib.resolve(process.cwd() + '/' + widgetId));

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

    function callService(serviceName, method, req, res, next) {
        var widgetId = req.header(consts.WIDGET_ID_HEADER);
        method = _.toUpper(method);
        serviceName = _.toUpper(serviceName);

        var widgetServices = services[widgetId];
        if (widgetServices) {
            var serviceScripts = widgetServices[serviceName];
            if (serviceScripts) {
                var serviceScript = serviceScripts[method];
                if (serviceScript) {
                    var helper = require('./services');

                    var vm = new NodeVM({
                        require: {
                            external: config.app.widgets.allowedModules
                        }
                    });
                    return vm.run(serviceScript, pathlib.resolve(process.cwd() + '/' + widgetId))(req, res, next, helper);
                } else {
                    throw new Error('Widget ' + widgetId + ' has no service ' + serviceName + ' for method ' + method + ' registered');
                }
            } else {
                throw new Error('Widget ' + widgetId + ' has no service ' + serviceName + ' registered');
            }
        } else {
            throw new Error('Widget ' + widgetId + ' does not have any services registered');
        }

    }

    function removeWidgetBackend(widgetId) {
        services = _.omit(services, widgetId);
    }

    return {
        importWidgetBackend,
        initWidgetBackends,
        removeWidgetBackend,
        callService
    }
})();
