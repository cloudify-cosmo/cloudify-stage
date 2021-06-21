/**
 * Created by jakubniezgoda on 06/11/2017.
 */

const _ = require('lodash');
const param = require('jquery-param');
const RequestHandler = require('../RequestHandler');
const consts = require('../../consts');

module.exports = (() => {
    function call(method, url, { params, body, parseResponse = true, headers, certificate } = {}) {
        return new Promise((resolve, reject) => {
            const options = { headers: {} };
            let fullUrl = url;
            if (!_.isEmpty(params)) {
                const queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
                fullUrl = `${url}${queryString}`;
            }
            if (headers) {
                options.headers = _.omit(headers, 'cert');
            }
            if (certificate) {
                options.agentOptions = {
                    ca: certificate
                };
            }
            if (body) {
                options.json = body;
                try {
                    const strData = JSON.stringify(body);
                    options.headers['content-length'] = Buffer.byteLength(strData);
                } catch (error) {
                    throw new Error(`Invalid (non-json) payload data. Error: ${error}`);
                }
            }

            RequestHandler.request(
                method,
                fullUrl,
                options,
                res => {
                    const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                    let responseBody = '';
                    res.on('data', chunk => {
                        responseBody += chunk;
                    });
                    res.on('end', () => {
                        if (isSuccess) {
                            if (parseResponse) {
                                const contentType = _.toLower(res.headers['content-type']);
                                if (contentType.indexOf('application/json') >= 0) {
                                    try {
                                        responseBody = JSON.parse(responseBody);
                                    } catch (error) {
                                        reject(`Invalid JSON response. Cannot parse. Data received: ${responseBody}`);
                                    }
                                }
                            }
                            resolve(responseBody);
                        } else {
                            reject(`Status: ${res.statusCode} ${res.statusMessage}. Data received: ${responseBody}`);
                        }
                    });
                },
                err => {
                    reject(err);
                }
            );
        });
    }

    function doGet(url, requestOptions) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, requestOptions);
    }

    function doPost(url, requestOptions) {
        return call(consts.ALLOWED_METHODS_OBJECT.post, url, requestOptions);
    }

    function doDelete(url, requestOptions) {
        return call(consts.ALLOWED_METHODS_OBJECT.delete, url, requestOptions);
    }

    function doPut(url, requestOptions) {
        return call(consts.ALLOWED_METHODS_OBJECT.put, url, requestOptions);
    }

    function doPatch(url, requestOptions) {
        return call(consts.ALLOWED_METHODS_OBJECT.patch, url, requestOptions);
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
