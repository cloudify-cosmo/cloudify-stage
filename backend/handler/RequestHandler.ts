import axios, { AxiosResponse } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { Response, Router } from 'express';
import bodyParser from 'body-parser';
import { getLogger } from './LoggerHandler';
import type { AllowedRequestMethod } from '../types';

const logger = getLogger('RequestHandler');

export function request(method: AllowedRequestMethod, requestUrl: string, options: AxiosRequestConfig = {}) {
    options.method = method;

    logger.debug(`Calling ${options.method} request to: ${requestUrl}`);
    return axios(requestUrl, options);
}

export function requestAndForwardResponse(url: string, response: Response, options?: AxiosRequestConfig) {
    return axios(url, { responseType: 'stream', ...options }).then(getResponseForwarder(response));
}

export function setUpRequestForwarding(router: Router) {
    router.use(bodyParser.raw({ inflate: false, type: () => true }));
}

export function forward(axiosResponse: AxiosResponse, expressResponse: Response) {
    expressResponse.status(axiosResponse.status).set(axiosResponse.headers);
    axiosResponse.data.pipe(expressResponse);
}

export function getResponseForwarder(expressResponse: Response) {
    return (axiosResponse: AxiosResponse) => forward(axiosResponse, expressResponse);
}
