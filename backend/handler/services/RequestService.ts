import type { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import https from 'https';
import { request } from '../RequestHandler';
import { ALLOWED_METHODS_OBJECT } from '../../consts';
import { getUrlWithQueryString } from '../../sharedUtils';
import type { QueryStringParams } from '../../sharedUtils';
import type { AllowedRequestMethod } from '../../types';

interface RequestOptions {
    body?: any;
    certificate?: string;
    headers?: Record<string, string>;
    params?: QueryStringParams;
    parseResponse?: boolean;
}

export function call(method: AllowedRequestMethod, url: string, requestOptions: RequestOptions = {}) {
    const { params, body, parseResponse = true, headers, certificate } = requestOptions;

    const options: AxiosRequestConfig = { headers: {} };
    if (!parseResponse) {
        options.responseType = 'arraybuffer';
    }
    if (headers) {
        options.headers = _.omit(headers, 'cert');
    }
    if (certificate) {
        options.httpsAgent = new https.Agent({
            ca: certificate
        });
    }
    if (body) {
        options.data = body;
    }

    return request(method, getUrlWithQueryString(url, params), options)
        .then(res => res.data)
        .catch(err => {
            if (err.response) {
                throw Error(`Status: ${err.status} ${err.statusText}. Data received: ${err.response.data}`);
            }
            throw err;
        });
}

export function doGet(url: string, requestOptions: RequestOptions) {
    return call(ALLOWED_METHODS_OBJECT.get, url, requestOptions);
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
