/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import _ from 'lodash';
import cookie from 'cookie';
import { jsonRequest } from '../ManagerHandler';
import { ALLOWED_METHODS_OBJECT, TOKEN_COOKIE_NAME } from '../../consts';
import { getUrlWithQueryString } from '../../sharedUtils';
import type { QueryStringParams } from '../../sharedUtils';
import type { AllowedRequestMethod } from '../../types';
import { getHeadersWithAuthenticationToken } from '../../utils';

type ManagerResponse = { items: any[] };
interface RequestOptions {
    body?: any;
    headers?: Record<string, string>;
    params?: QueryStringParams;
    timeout?: number;
}

export function call(method: AllowedRequestMethod, url: string, requestOptions: RequestOptions = {}) {
    const { params, body = null, timeout } = requestOptions;
    let { headers = {} } = requestOptions;
    if (headers.cookie) {
        const cookies = cookie.parse(headers.cookie);
        headers = getHeadersWithAuthenticationToken(cookies[TOKEN_COOKIE_NAME], headers);
    }
    return jsonRequest(method, getUrlWithQueryString(url, params), headers, body, timeout);
}

export function doGet(url: string, requestOptions: RequestOptions) {
    return call(ALLOWED_METHODS_OBJECT.get, url, requestOptions);
}

export function doGetFull(
    url: string,
    requestOptions: RequestOptions = {},
    fullData: ManagerResponse = { items: [] },
    size = 0
): Promise<ManagerResponse> {
    requestOptions.params = requestOptions.params || {};
    requestOptions.params._size = 1000;
    requestOptions.params._offset = size;

    const promise = doGet(url, requestOptions) as Promise<ManagerResponse>;

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

export function doPost(url: string, requestOptions: RequestOptions) {
    return call(ALLOWED_METHODS_OBJECT.post, url, requestOptions);
}

export function doDelete(url: string, requestOptions: RequestOptions) {
    return call(ALLOWED_METHODS_OBJECT.delete, url, requestOptions);
}

export function doPut(url: string, requestOptions: RequestOptions) {
    return call(ALLOWED_METHODS_OBJECT.put, url, requestOptions);
}

export function doPatch(url: string, requestOptions: RequestOptions) {
    return call(ALLOWED_METHODS_OBJECT.patch, url, requestOptions);
}
