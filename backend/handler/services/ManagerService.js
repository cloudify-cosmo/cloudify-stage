/**
 * Created by jakubniezgoda on 06/11/2017.
 */

const _ = require('lodash');
const param = require('jquery-param');
const ManagerHandler = require('../ManagerHandler');
const consts = require('../../consts');

module.exports = (function() {
    function call(method, url, params, data, headers = {}) {
        if (!_.isEmpty(params)) {
            const queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
            url = `${url}${queryString}`;
        }
        return ManagerHandler.jsonRequest(method, url, headers, data);
    }

    function doGet(url, params, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, params, null, headers);
    }

    function doGetFull(url, params, headers, fullData = { items: [] }, size = 0) {
        params._size = 1000;
        params._offset = size;

        const promise = this.doGet(url, params, headers);

        return promise.then(data => {
            size += data.items.length;
            fullData.items = _.concat(fullData.items, data.items);
            const total = _.get(data, 'metadata.pagination.total');

            if (total > size) {
                return this.doGetFull(url, params, headers, fullData, size);
            }
            return fullData;
        });
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
        doGetFull,
        doPost,
        doDelete,
        doPut,
        doPatch
    };
})();
