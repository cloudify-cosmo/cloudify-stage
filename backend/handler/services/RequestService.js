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
                options.body = data;
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

    function get(url, params, headers, data) {
        return call('get', url, params, headers, data);
    }

    function post(url, params, headers, data) {
        return call('post', url, params, headers, data);
    }

    function del(url, params, headers, data) {
        return call('delete', url, params, headers, data);
    }

    function put(url, params, headers, data) {
        return call('put', url, params, headers, data);
    }

    function patch(url, params, headers, data) {
        return call('PATCH', url, params, headers, data);
    }

    return {
        call,
        get,
        post,
        del,
        put,
        patch
    };
})();