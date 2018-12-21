'use strict';
/**
 * Created by jakubniezgoda on 18/07/2017.
 */

var _ = require('lodash');
var fs = require('fs-extra');
var config = require('../config').get();
var logger = require('log4js').getLogger('ManagerHandler');
var RequestHandler = require('./RequestHandler');

module.exports = (function() {

    var caFile = null;
    try {
        caFile = _.get(config,'app.ssl.ca') ? fs.readFileSync(config.app.ssl.ca) : null;
    } catch (e) {
        logger.error('Could not setup ssl ca, error loading file.', e);
        process.exit(1);
    }

    function getUrl() {
        return config.managerUrl + '/api/' + config.manager.apiVersion;
    }

    function updateOptions(options, method, timeout, headers, data) {
        if (caFile) {
            logger.debug('Adding CA file to Agent Options');
            options.agentOptions = {
                ca: caFile
            };
        }

        options.timeout = timeout || config.app.proxy.timeouts[method.toLowerCase()];

        if (headers) {
            options.headers = _.omit(headers, 'host');
        }

        if (data) {
            options.json = data;
            try {
                data = JSON.stringify(data);
                options.headers = {...options.headers, 'content-length':  Buffer.byteLength(data)};
            } catch (error) {
                logger.error('Invalid payload data. Error:', error)
            }
        }
    }

    function request(method, url, headers, data, onSuccess, onError, timeout) {
        var requestUrl = this.getUrl() + (_.startsWith(url, '/') ? url : `/${url}`);
        var requestOptions = {};
        this.updateOptions(requestOptions, method, timeout, headers, data);

        logger.debug(`Preparing ${method} request to manager: ${requestUrl}`);
        return RequestHandler.request(method, requestUrl, requestOptions, onSuccess, onError);
    }

    // the request assumes the response is JSON
    function jsonRequest(method, url, headers, data, timeout){
        return new Promise((resolve, reject) => {
            this.request(method, url, headers, data, (res) => {
                var isSuccess = res.statusCode >= 200 && res.statusCode <300;

                RequestHandler.getResponseJson(res).then((data) =>
                    isSuccess
                        ? resolve(data)
                        : reject(data)
                ).catch((e) =>
                    isSuccess
                        ? reject('response data could not be parsed to JSON: ' + e)
                        : reject(res.statusMessage)
                );
            }, (err) => reject(err), timeout);
        });
    }

    return {
        getUrl,
        updateOptions,
        request,
        jsonRequest
    };
})();
