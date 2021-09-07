// @ts-nocheck File not migrated fully to TS

import _ from 'lodash';
import fs from 'fs-extra';
import { getLogger } from './LoggerHandler';
import { getConfig } from '../config';
import * as RequestHandler from './RequestHandler';

const logger = getLogger('ManagerHandler');

let caFile = null;
try {
    const caPath = _.get(getConfig(), 'app.ssl.ca');
    caFile = caPath ? fs.readFileSync(caPath) : null;
} catch (e) {
    throw new Error('Could not setup ssl ca, error loading file.', e);
}

export function getManagerUrl() {
    return getConfig().managerUrl;
}

export function getApiUrl() {
    return `${getConfig().managerUrl}/api/${getConfig().manager.apiVersion}`;
}

export function updateOptions(options, method, timeout, headers, data) {
    if (caFile) {
        logger.debug('Adding CA file to Agent Options');
        options.agentOptions = {
            ca: caFile
        };
    }

    options.timeout = timeout || getConfig().app.proxy.timeouts[method.toLowerCase()];

    if (headers) {
        options.headers = _.omit(headers, 'host');
    }

    if (data) {
        options.json = data;
        try {
            const strData = JSON.stringify(data);
            options.headers = { ...options.headers, 'content-length': Buffer.byteLength(strData) };
        } catch (error) {
            logger.error('Invalid payload data. Error:', error);
        }
    }
}

export function request(method, url, headers, data, onSuccess, onError, timeout) {
    const requestUrl = getApiUrl() + (_.startsWith(url, '/') ? url : `/${url}`);
    const requestOptions = {};
    updateOptions(requestOptions, method, timeout, headers, data);

    logger.debug(`Preparing ${method} request to manager: ${requestUrl}`);
    return RequestHandler.request(method, requestUrl, requestOptions, onSuccess, onError);
}

// the request assumes the response is JSON
export function jsonRequest(method, url, headers, data, timeout) {
    return new Promise((resolve, reject) => {
        request(
            method,
            url,
            headers,
            data,
            res => {
                const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

                RequestHandler.getResponseJson(res)
                    .then(json => (isSuccess ? resolve(json) : reject(json)))
                    .catch(e =>
                        isSuccess
                            ? reject(`response data could not be parsed to JSON: ${e}`)
                            : reject(res.statusMessage)
                    );
            },
            err => reject(err),
            timeout
        );
    });
}
