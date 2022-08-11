import { isEmpty } from 'lodash';
import { stringify } from 'query-string';

/**
 * @file
 * Contains utility functions shared across backend and frontend.
 * This file is not supposed to reference any node-specific APIs.
 */

export function isYamlFile(filename: string) {
    const lowercaseFilename = filename.toLowerCase();
    return lowercaseFilename.endsWith('.yaml') || lowercaseFilename.endsWith('.yml');
}

export type QueryStringParams = Record<string, any>;

export function getUrlWithQueryString(url: string, params?: QueryStringParams) {
    if (!params || isEmpty(params)) return url;

    const prefix = url?.includes('?') ? '&' : '?';
    const queryString = prefix + stringify(params, { sort: false });
    return `${url}${queryString}`;
}
