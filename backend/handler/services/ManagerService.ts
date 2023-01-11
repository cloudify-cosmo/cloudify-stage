/* eslint no-underscore-dangle: ["error", { "allow": ["_size", "_offset"] }] */

import _ from 'lodash';
import cookie from 'cookie';
import { jsonRequest } from '../ManagerHandler';
import { ALLOWED_METHODS_OBJECT, TOKEN_COOKIE_NAME } from '../../consts';
import { getUrlWithQueryString } from '../../sharedUtils';
import { getHeadersWithAuthenticationToken } from '../../utils';
import type { ManagerResponse, ManagerService } from './ManagerService.types';

const managerService: ManagerService = {
    call(method, url, requestOptions = {}) {
        const { params, body = null, timeout } = requestOptions;
        let { headers = {} } = requestOptions;
        if (headers.cookie) {
            const cookies = cookie.parse(headers.cookie);
            headers = getHeadersWithAuthenticationToken(cookies[TOKEN_COOKIE_NAME], headers);
        }
        return jsonRequest(method, getUrlWithQueryString(url, params), headers, body, timeout);
    },

    doGet(url, requestOptions) {
        return this.call(ALLOWED_METHODS_OBJECT.get, url, requestOptions);
    },

    doGetFull(url, requestOptions, fullData, size = 0) {
        requestOptions.params = requestOptions.params || {};
        requestOptions.params._size = 1000;
        requestOptions.params._offset = size;

        const promise = this.doGet(url, requestOptions) as unknown as Promise<ManagerResponse>;

        return promise.then(data => {
            const cumulativeSize = size + data.items.length;
            const totalSize = _.get(data, 'metadata.pagination.total');

            fullData.items = _.concat(fullData.items, data.items);

            if (totalSize > cumulativeSize) {
                return this.doGetFull(url, requestOptions, fullData, cumulativeSize);
            }
            return fullData;
        });
    },

    doPost(url, requestOptions) {
        return this.call(ALLOWED_METHODS_OBJECT.post, url, requestOptions);
    },

    doDelete(url, requestOptions) {
        return this.call(ALLOWED_METHODS_OBJECT.delete, url, requestOptions);
    },

    doPut(url, requestOptions) {
        return this.call(ALLOWED_METHODS_OBJECT.put, url, requestOptions);
    },

    doPatch(url, requestOptions) {
        return this.call(ALLOWED_METHODS_OBJECT.patch, url, requestOptions);
    }
};

export default managerService;
