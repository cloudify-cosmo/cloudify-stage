/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

const _ = require('lodash');
const param = require('jquery-param');
const ManagerHandler = require('../ManagerHandler');
const consts = require('../../consts');

module.exports = (() => {
    function call(method, url, { params, body = null, headers = {} } = {}) {
        let fullUrl = url;
        if (!_.isEmpty(params)) {
            const queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
            fullUrl = `${url}${queryString}`;
        }
        return ManagerHandler.jsonRequest(method, fullUrl, headers, body);
    }

    function doGet(url, requestOptions) {
        return call(consts.ALLOWED_METHODS_OBJECT.get, url, requestOptions);
    }

    function doGetFull(url, requestOptions = {}, fullData = { items: [] }, size = 0) {
        requestOptions.params = requestOptions.params || {};
        requestOptions.params._size = 1000;
        requestOptions.params._offset = size;

        const promise = this.doGet(url, requestOptions);

        return promise.then(data => {
            const cumulativeSize = size + data.items.length;
            const totalSize = _.get(data, 'metadata.pagination.total');

            fullData.items = _.concat(fullData.items, data.items);

            if (totalSize > cumulativeSize) {
                return this.doGetFull(url, requestOptions, fullData, cumulativeSize);
            }
            return fullData;
        });
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
        doGetFull,
        doPost,
        doDelete,
        doPut,
        doPatch
    };
})();
