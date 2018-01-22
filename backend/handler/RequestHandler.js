'use strict';
/**
 * Created by jakubniezgoda on 11/08/2017.
 */

var req = require('request');
var logger = require('log4js').getLogger('RequestHandler');

module.exports = (function() {
    function request(method, requestUrl, options, onSuccess, onError) {
        options.method = method;

        logger.debug(`Calling ${options.method} request to: ${requestUrl}`);
        return req(requestUrl, options)
            .on('error', onError)
            .on('response', onSuccess)
    };

    function getResponseJson(res) {
        return new Promise((resolve, reject) => {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                try {
                    var jsonResponse = JSON.parse(body);
                    resolve(jsonResponse);
                }
                catch(e) {
                    reject(e);
                }
            });
        });
    }

    return {
        request,
        getResponseJson
    };
})();
