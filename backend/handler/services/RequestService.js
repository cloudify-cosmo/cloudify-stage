/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var _ = require('lodash');
var param = require('jquery-param');
var RequestHandler = require('../RequestHandler');
var consts = require('../../consts');

module.exports = (function() {

    function call(method, url, params, data, parseResponse=true, headers={}) {
        return new Promise((resolve, reject) => {
            var options = {headers: {}};
            if (!_.isEmpty(params)) {
                var queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
                url = `${url}${queryString}`;
            }
            if (headers) {
                options.headers = headers;
            }
            if (data) {
                options.json = data;
                try {
                    data = JSON.stringify(data);
                    options.headers['content-length'] = Buffer.byteLength(data);
                } catch (error) {
                    throw new Error('Invalid (non-json) payload data. Error: ' + error)
                }
            }

            RequestHandler.request(method, url, options, (res) => {
                var isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    if (isSuccess) {
                        if (parseResponse) {
                            var contentType = _.toLower(res.headers['content-type']);
                            if (contentType.indexOf('application/json') >= 0) {
                                try {
                                    body = JSON.parse(body);
                                } catch (error) {
                                    reject(`Invalid JSON response. Cannot parse. Data received: ${body}`);
                                }
                            }
                        }
                        resolve(body);
                    } else {
                        reject(`Status: ${res.statusCode} ${res.statusMessage}. Data received: ${body}`);
                    }
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    function doGet(url, params, parseResponse, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, params, null, parseResponse, headers);
    }

    function doPost(url, params, data, parseResponse, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.post, url, params, data, parseResponse, headers);
    }

    function doDelete(url, params, data, parseResponse, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.delete, url, params, data, parseResponse, headers);
    }

    function doPut(url, params, data, parseResponse, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.put, url, params, data, parseResponse, headers);
    }

    function doPatch(url, params, data, parseResponse, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.patch, url, params, data, parseResponse, headers);
    }

    return {
        call,
        doGet,
        doPost,
        doDelete,
        doPut,
        doPatch
    };
})();