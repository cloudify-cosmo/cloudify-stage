import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import type { Response } from 'express';
import type { AllowedRequestMethod } from '../types';
import { getLogger } from './LoggerHandler';

const logger = getLogger('RequestHandler');

export function request(method: AllowedRequestMethod, requestUrl: string, options: AxiosRequestConfig = {}) {
    options.method = method;

    logger.debug(`Calling ${options.method} request to: ${requestUrl}`);
    return axios(requestUrl, options);
}

export function requestAndForwardResponse(url: string, response: Response, options?: AxiosRequestConfig) {
    return axios(url, { responseType: 'stream', ...options }).then(getResponseForwarder(response));
}

export function forward(axiosResponse: AxiosResponse, expressResponse: Response) {
    expressResponse.status(axiosResponse.status).set(axiosResponse.headers);
    axiosResponse.data.pipe(expressResponse);
}

export function getResponseForwarder(expressResponse: Response) {
    return (axiosResponse: AxiosResponse) => forward(axiosResponse, expressResponse);
}
