import type { AxiosRequestHeaders } from 'axios';
import type { Request } from 'express';
import pathlib from 'path';
import * as Consts from './consts';
import { TOKEN_COOKIE_NAME } from './consts';

export const isDevelopmentOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export function getResourcePath(path: string, isUserData: boolean) {
    if (isDevelopmentOrTest) {
        // TODO(RD-1402): use a temporary directory during tests
        return pathlib.resolve(`..${isUserData ? Consts.USER_DATA_PATH : ''}/${path}`);
    }
    return pathlib.resolve(`../dist/${isUserData ? Consts.USER_DATA_PATH : Consts.APP_DATA_PATH}/${path}`);
}

export function getValuesWithPaths(obj: Record<string, any>, key: string, arr: string[] = []) {
    let objects: any[] = [];
    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getValuesWithPaths(obj[i], key, [...arr, i]));
        } else if (i === key) {
            objects.push({ [obj[i]]: arr });
        }
    });
    return objects;
}

export function getParams(query: string) {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params: Record<string, string>, param) => {
              const [key, value] = param.split('=');
              params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
              return params;
          }, {})
        : {};
}

export function getTokenFromCookies(req: Request) {
    return req.cookies[TOKEN_COOKIE_NAME] as string;
}

function getAuthenticationTokenHeader(token: string) {
    return { 'Authentication-Token': token };
}

export function getHeadersWithAuthenticationTokenFromRequest(req: Request, headers: AxiosRequestHeaders = {}) {
    const token = getTokenFromCookies(req);
    return { ...headers, ...getAuthenticationTokenHeader(token) };
}

export function getHeadersWithAuthenticationToken(token: string, headers: AxiosRequestHeaders = {}) {
    return { ...headers, ...getAuthenticationTokenHeader(token) };
}

export function isYamlFile(filename: string) {
    const lowercaseFilename = filename.toLowerCase();
    return lowercaseFilename.endsWith('.yaml') || lowercaseFilename.endsWith('.yml');
}
