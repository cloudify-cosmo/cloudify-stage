import _ from 'lodash';
import fs from 'fs-extra';
import https from 'https';

import type { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

import { getLogger } from './LoggerHandler';
import { getConfig } from '../config';
import * as RequestHandler from './RequestHandler';
import type { AllowedRequestMethod } from '../types';

const logger = getLogger('ManagerHandler');

let caFile: Buffer | null = null;
try {
    const caPath = _.get(getConfig(), 'app.ssl.ca');
    caFile = caPath ? fs.readFileSync(caPath) : null;
} catch (e) {
    throw new Error(`Could not setup ssl ca, error loading file: ${e}`);
}

export function getManagerUrl() {
    return getConfig().managerUrl;
}

export function getApiUrl() {
    return `${getConfig().managerUrl}/api/${getConfig().manager.apiVersion}`;
}

export function setManagerSpecificOptions(options: AxiosRequestConfig, method: string, timeout?: number) {
    if (caFile) {
        logger.debug('Adding CA file to Agent Options');
        options.httpsAgent = new https.Agent({
            ca: caFile
        });
    }

    // @ts-ignore It's not possible to determine if provided method is defined in timeouts object
    const customTimeout: number | undefined = getConfig().app.proxy.timeouts[method.toLowerCase()];
    options.timeout = timeout || customTimeout;

    options.headers = _.omit(options.headers, 'host');
}

export function request(method: string, url: string, requestOptions: AxiosRequestConfig, timeout?: number) {
    const requestUrl = getApiUrl() + (_.startsWith(url, '/') ? url : `/${url}`);
    setManagerSpecificOptions(requestOptions, method, timeout);

    logger.debug(`Preparing ${method} request to manager: ${requestUrl}`);
    return RequestHandler.request(method as AllowedRequestMethod, requestUrl, requestOptions);
}

// the request assumes the response is JSON
export function jsonRequest<ResponseBody>(
    method: string,
    url: string,
    headers: RawAxiosRequestHeaders,
    data?: any,
    timeout?: number
) {
    return request(method, url, { headers, data }, timeout)
        .then(res => <ResponseBody>res.data)
        .catch(err => {
            if (err.response) {
                throw err.response.data;
            }
            throw err;
        });
}
