import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import type { Response } from 'express';
import type { AllowedRequestMethod } from '../types';
import { getLogger } from './LoggerHandler';

const logger = getLogger('RequestHandler');

type ForwardingOptions = {
    blockHtmlContent?: boolean;
};

export function request(method: AllowedRequestMethod, requestUrl: string, options: AxiosRequestConfig = {}) {
    options.method = method;

    logger.debug(`Calling ${options.method} request to: ${requestUrl}`);
    return axios(requestUrl, options);
}

export function requestAndForwardResponse(
    url: string,
    response: Response,
    options?: AxiosRequestConfig & ForwardingOptions
) {
    const forwardingOptions: ForwardingOptions = { blockHtmlContent: options?.blockHtmlContent };
    return axios(url, { responseType: 'stream', ...options }).then(getResponseForwarder(response, forwardingOptions));
}

export function forward(
    axiosResponse: AxiosResponse,
    expressResponse: Response,
    forwardingOptions?: ForwardingOptions
) {
    const responseContentType = axiosResponse.headers['content-type'];

    if (forwardingOptions?.blockHtmlContent && responseContentType.includes('html')) {
        logger.warn(`Unsupported content type: ${responseContentType}`);
        expressResponse.status(403).send({ message: 'Forbidden' });
    } else {
        expressResponse.status(axiosResponse.status).set(axiosResponse.headers);
        axiosResponse.data.pipe(expressResponse);
    }
}

export function getResponseForwarder(expressResponse: Response, forwardingOptions?: ForwardingOptions) {
    return (axiosResponse: AxiosResponse) => forward(axiosResponse, expressResponse, forwardingOptions);
}
