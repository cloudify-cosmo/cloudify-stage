import express from 'express';
import axios from 'axios';
import type { AxiosResponse, AxiosRequestConfig } from 'axios';
import type { Response, Router } from 'express';
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
    router.use(express.raw({ inflate: false, type: () => true }));
}

export function forward(axiosResponse: AxiosResponse, expressResponse: Response) {
    expressResponse.status(axiosResponse.status).set(axiosResponse.headers);
    axiosResponse.data.pipe(expressResponse);
}

export function getResponseForwarder(expressResponse: Response) {
    return (axiosResponse: AxiosResponse) => forward(axiosResponse, expressResponse);
}
