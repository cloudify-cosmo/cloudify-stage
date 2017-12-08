/**
 * Created by jakubniezgoda on 06/11/2017.
 */

var _ = require('lodash');
var param = require('jquery-param');
var ManagerHandler = require('../ManagerHandler');
var consts = require('../../consts');

module.exports = (function() {
    function call(method, url, params, data, headers={}) {
        if (!_.isEmpty(params)) {
            var queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
            url = `${url}${queryString}`;
        }
        return ManagerHandler.jsonRequest(method, url, headers, data);
    }

    function doGet(url, params, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, params, null, headers);
    }

    function doPost(url, params, data, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.post, url, params, data, headers);
    }

    function doDelete(url, params, data, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.delete, url, params, data, headers);
    }

    function doPut(url, params, data, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.put, url, params, data, headers);
    }

    function doPatch(url, params, data, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.patch, url, params, data, headers);
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