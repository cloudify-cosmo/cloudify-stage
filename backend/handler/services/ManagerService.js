/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var ManagerHandler = require('../ManagerHandler');

module.exports = (function() {
    function call(method, url, headers, data) {
        return ManagerHandler.jsonRequest(method, url, headers, data);
    }

    function doGet(url, headers, data) {
        return call('get', url, headers, data);
    }

    function doPost(url, headers, data) {
        return call('post', url, headers, data);
    }

    function doDelete(url, headers, data) {
        return call('delete', url, headers, data);
    }

    function doPut(url, headers, data) {
        return call('put', url, headers, data);
    }

    function doPatch(url, headers, data) {
        return call('PATCH', url, headers, data);
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