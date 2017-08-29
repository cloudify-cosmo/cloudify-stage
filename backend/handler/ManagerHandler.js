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

    function updateOptions(options, method, timeout, headers) {
        if (caFile) {
            logger.debug('Adding CA file to Agent Options. CA File =', caFile);
            options.agentOptions = {
                ca: caFile
            };
        }

        options.timeout = timeout || config.app.proxy.timeouts[method.toLowerCase()];

        if (headers) {
            options.headers = headers;
        }
    }

    function request(method, url, headers, onSuccess, onError, timeout) {
        var requestUrl = this.getUrl() + url;
        var requestOptions = {};
        this.updateOptions(requestOptions, method, timeout, headers);

        logger.debug(`Preparing ${method} request to manager with options: ${JSON.stringify(requestOptions)}`);
        return RequestHandler.request(method, requestUrl, requestOptions, onSuccess, onError);
    }

    // the request assumes the response is JSON
    function jsonRequest(method, url, headers, timeout){
        return new Promise((resolve, reject) => {
            this.request(method, url, headers, (res) => {
                if(res.statusCode >= 200 && res.statusCode <300){
                    res.on('data', (data) => {
                        try {
                            data = JSON.parse(data);
                            resolve(data);
                        }
                        catch(e){
                            reject('response data could not be parsed to JSON: ', e);
                        }
                    })
                } else{
                    reject(res.statusMessage);
                }
            }, (err) => {
                reject(err);
            }, timeout);
        })
    }

    return {
        getUrl,
        updateOptions,
        request,
        jsonRequest
    };
})();
