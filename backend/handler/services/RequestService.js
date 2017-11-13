/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var RequestHandler = require('../RequestHandler');

module.exports = (function() {

    function call(method, url, params, headers, data) {
        return new Promise((resolve, reject) => {
            var options = {};
            if (headers) {
                options.headers = headers;
            }
            if (data) {
                options.json = data;
                try {
                    options.headers['content-length'] = JSON.stringify(data).length;
                } catch (error) {
                    throw new Error('Invalid (non-json) payload data. Error:', error)
                }
            }
            if (params) {
                url = (url.indexOf('?') > 0? '&' : '?') + $.param(params, true);
            }

            RequestHandler.request(method, url, options, (res) => {
                var isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                var body = '';
                res.on('data', function(chunk) {
                    body += chunk;
                });
                res.on('end', function() {
                    if (isSuccess) {
                        resolve(body)
                    } else {
                        reject(`Status: ${res.statusCode} ${res.statusMessage}. Data received: ${body}`);
                    }
                });
            }, (err) => {
                reject(err);
            });
        });
    }

    function doGet(url, params, headers, data) {
        return call('get', url, params, headers, data);
    }

    function doPost(url, params, headers, data) {
        return call('post', url, params, headers, data);
    }

    function doDelete(url, params, headers, data) {
        return call('delete', url, params, headers, data);
    }

    function doPut(url, params, headers, data) {
        return call('put', url, params, headers, data);
    }

    function doPatch(url, params, headers, data) {
        return call('PATCH', url, params, headers, data);
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