'use strict';
/**
 * Created by jakubniezgoda on 18/07/2017.
 */

var _ = require('lodash');
var fs = require('fs-extra');
var request = require('request');
var config = require('../config').get();
var logger = require('log4js').getLogger('ManagerHandler');

module.exports = (function() {

    var caFile = null;
    try {
        caFile = _.get(config,'app.ssl.ca') ? fs.readFileSync(config.app.ssl.ca) : null;
    } catch (e) {
        logger.error('Could not setup ssl ca, error loading file.', e);
        process.exit(1);
    }

    function getUrl() {
        return config.managerUrl;
    }

    function updateOptions(options, timeout, headers) {
        if (caFile) {
            logger.debug('Adding CA file to Agent Options. CA File =', caFile);
            options.agentOptions = {
                ca: caFile
            };
        }
        if (timeout) {
            options.timeout = timeout;
        }
        if (headers) {
            options.headers = headers;
        }
    }

    function getRequest(url, headers, onSuccess, onError, timeout) {
        var requestUrl = this.getUrl() + '/api/' + config.manager.apiVersion + url;
        var requestOptions = {};
        this.updateOptions(requestOptions, timeout, headers);

        logger.debug('Calling GET request to:', requestUrl);
        return request.get(requestUrl, requestOptions)
                      .on('error', onError)
                      .on('response', onSuccess);
    }

    return {
        getUrl,
        updateOptions,
        getRequest
    };
})();
