/**
 * Created by jakubniezgoda on 06/11/2017.
 */

const _ = require('lodash');
const param = require('jquery-param');
const RequestHandler = require('../RequestHandler');
const consts = require('../../consts');

module.exports = (() => {
    function call(method, url, params, data, parseResponse = true, headers = {}, certificate = null) {
        return new Promise((resolve, reject) => {
            const options = { headers: {} };
            if (!_.isEmpty(params)) {
                const queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
                url = `${url}${queryString}`;
            }
            if (headers) {
                options.headers = _.omit(headers, 'cert');
            }
            if (certificate) {
                options.agentOptions = {
                    ca: certificate
                };
            }
            if (data) {
                options.json = data;
                try {
                    data = JSON.stringify(data);
                    options.headers['content-length'] = Buffer.byteLength(data);
                } catch (error) {
                    throw new Error(`Invalid (non-json) payload data. Error: ${error}`);
                }
            }

            RequestHandler.request(
                method,
                url,
                options,
                res => {
                    const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                    let body = '';
                    res.on('data', chunk => {
                        body += chunk;
                    });
                    res.on('end', () => {
                        if (isSuccess) {
                            if (parseResponse) {
                                const contentType = _.toLower(res.headers['content-type']);
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
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    function doGet(url, params, parseResponse, headers, certificate) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, params, null, parseResponse, headers, certificate);
    }

    function doPost(url, params, data, parseResponse, headers, certificate) {
        return call(consts.ALLOWED_METHODS_OBJECT.post, url, params, data, parseResponse, headers, certificate);
    }

    function doDelete(url, params, data, parseResponse, headers, certificate) {
        return call(consts.ALLOWED_METHODS_OBJECT.delete, url, params, data, parseResponse, headers, certificate);
    }

    function doPut(url, params, data, parseResponse, headers, certificate) {
        return call(consts.ALLOWED_METHODS_OBJECT.put, url, params, data, parseResponse, headers, certificate);
    }

    function doPatch(url, params, data, parseResponse, headers, certificate) {
        return call(consts.ALLOWED_METHODS_OBJECT.patch, url, params, data, parseResponse, headers, certificate);
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
