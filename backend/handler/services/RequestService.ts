// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { stringify } from 'query-string';
import { request } from '../RequestHandler';
import { ALLOWED_METHODS_OBJECT } from '../../consts';
import { getUrlWithQueryString } from './common';

export function call(method, url, { params, body, parseResponse = true, headers, certificate } = {}) {
    return new Promise((resolve, reject) => {
        const options = { headers: {} };
        if (headers) {
            options.headers = _.omit(headers, 'cert');
        }
        if (certificate) {
            options.agentOptions = {
                ca: certificate
            };
        }
        if (body) {
            options.json = body;
            try {
                const strData = JSON.stringify(body);
                options.headers['content-length'] = Buffer.byteLength(strData);
            } catch (error) {
                throw new Error(`Invalid (non-json) payload data. Error: ${error}`);
            }
        }

        request(
            method,
            getUrlWithQueryString(url, params),
            options,
            res => {
                const isSuccess = res.statusCode >= 200 && res.statusCode < 300;
                let responseBody = '';
                res.on('data', chunk => {
                    responseBody += chunk;
                });
                res.on('end', () => {
                    if (isSuccess) {
                        if (parseResponse) {
                            const contentType = _.toLower(res.headers['content-type']);
                            if (contentType.indexOf('application/json') >= 0) {
                                try {
                                    responseBody = JSON.parse(responseBody);
                                } catch (error) {
                                    reject(`Invalid JSON response. Cannot parse. Data received: ${responseBody}`);
                                }
                            }
                        }
                        resolve(responseBody);
                    } else {
                        reject(`Status: ${res.statusCode} ${res.statusMessage}. Data received: ${responseBody}`);
                    }
                });
            },
            err => {
                reject(err);
            }
        );
    });
}

export function doGet(url, requestOptions) {
    return call(ALLOWED_METHODS_OBJECT.get, url, requestOptions);
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
