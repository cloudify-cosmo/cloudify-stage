/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var ManagerHandler = require('../ManagerHandler');

module.exports = (function() {
    function call(method, url, headers, data) {
        return ManagerHandler.jsonRequest(method, url, headers, data);
    }

    function get(url, headers, data) {
        return call('get', url, headers, data);
    }

    function post(url, headers, data) {
        return call('post', url, headers, data);
    }

    function del(url, headers, data) {
        return call('delete', url, headers, data);
    }

    function put(url, headers, data) {
        return call('put', url, headers, data);
    }

    function patch(url, headers, data) {
        return call('PATCH', url, headers, data);
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