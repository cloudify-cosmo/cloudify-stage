import req from 'request';
import type { Response } from 'request';
import { getLogger } from './LoggerHandler';
import type { AllowedRequestMethod } from '../types';

const logger = getLogger('RequestHandler');

export function request(
    method: AllowedRequestMethod,
    requestUrl: string,
    options: req.CoreOptions = {},
    onSuccess: (response: req.Response) => void,
    onError: (error: Error) => void
) {
    options.method = method;

    logger.debug(`Calling ${options.method} request to: ${requestUrl}`);
    return req(requestUrl, options).on('error', onError).on('response', onSuccess);
}

export function getResponseJson(res: Response) {
    return new Promise((resolve, reject) => {
        let body = '';
        res.on('data', chunk => {
            body += chunk;
        });
        res.on('end', () => {
            try {
                const jsonResponse = JSON.parse(body);
                resolve(jsonResponse);
            } catch (e) {
                reject(e);
            }
        });
    });
}
