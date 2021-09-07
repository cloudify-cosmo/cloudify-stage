// @ts-nocheck File not migrated fully to TS
/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import _ from 'lodash';
import param from 'jquery-param';
import { jsonRequest } from '../ManagerHandler';
import { ALLOWED_METHODS_OBJECT } from '../../consts';

export function call(method, url, { params, body = null, headers = {} } = {}) {
    let fullUrl = url;
    if (!_.isEmpty(params)) {
        const queryString = (url.indexOf('?') > 0 ? '&' : '?') + param(params, true);
        fullUrl = `${url}${queryString}`;
    }
    return jsonRequest(method, fullUrl, headers, body);
}

export function doGet(url, requestOptions) {
    return call(ALLOWED_METHODS_OBJECT.get, url, requestOptions);
}

export function doGetFull(url, requestOptions = {}, fullData = { items: [] }, size = 0) {
    requestOptions.params = requestOptions.params || {};
    requestOptions.params._size = 1000;
    requestOptions.params._offset = size;

    const promise = doGet(url, requestOptions);

    return promise.then(data => {
        const cumulativeSize = size + data.items.length;
        const totalSize = _.get(data, 'metadata.pagination.total');

        fullData.items = _.concat(fullData.items, data.items);

        if (totalSize > cumulativeSize) {
            return doGetFull(url, requestOptions, fullData, cumulativeSize);
        }
        return fullData;
    });
}

export function doPost(url, requestOptions) {
    return call(ALLOWED_METHODS_OBJECT.post, url, requestOptions);
}

export function doDelete(url, requestOptions) {
    return call(ALLOWED_METHODS_OBJECT.delete, url, requestOptions);
}

export function doPut(url, requestOptions) {
    return call(ALLOWED_METHODS_OBJECT.put, url, requestOptions);
}

export function doPatch(url, requestOptions) {
    return call(ALLOWED_METHODS_OBJECT.patch, url, requestOptions);
}
