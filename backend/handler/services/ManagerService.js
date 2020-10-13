/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

const _ = require('lodash');
const param = require('jquery-param');
const ManagerHandler = require('../ManagerHandler');
const consts = require('../../consts');

module.exports = (() => {
    function call(method, url, params, data, headers = {}) {
        let fullUrl = url;
        if (!_.isEmpty(params)) {
            const queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
            fullUrl = `${url}${queryString}`;
        }
        return ManagerHandler.jsonRequest(method, fullUrl, headers, data);
    }

    function doGet(url, params, headers) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, params, null, headers);
    }

    function doGetFull(url, params, headers, fullData = { items: [] }, size = 0) {
        params._size = 1000;
        params._offset = size;

        const promise = this.doGet(url, params, headers);

        return promise.then(data => {
            const cumulativeSize = size + data.items.length;
            const totalSize = _.get(data, 'metadata.pagination.total');

            fullData.items = _.concat(fullData.items, data.items);

            if (totalSize > cumulativeSize) {
                return this.doGetFull(url, params, headers, fullData, cumulativeSize);
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
