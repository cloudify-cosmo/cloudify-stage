// @ts-nocheck File not migrated fully to TS

import req from 'request';
import { getLogger } from './LoggerHandler';

const logger = getLogger('RequestHandler');

export function request(method, requestUrl, options, onSuccess, onError) {
    options.method = method;

    logger.debug(`Calling ${options.method} request to: ${requestUrl}`);
    return req(requestUrl, options).on('error', onError).on('response', onSuccess);
}

export function getResponseJson(res) {
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
