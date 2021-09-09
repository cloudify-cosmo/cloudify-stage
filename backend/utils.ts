// @ts-nocheck File not migrated fully to TS
import pathlib from 'path';
import * as Consts from './consts';

export const isDevelopmentOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

export function getResourcePath(path: string, isUserData: boolean) {
    if (isDevelopmentOrTest) {
        // TODO(RD-1402): use a temporary directory during tests
        return pathlib.resolve(`..${isUserData ? Consts.USER_DATA_PATH : ''}/${path}`);
    }
    return pathlib.resolve(`../dist/${isUserData ? Consts.USER_DATA_PATH : Consts.APP_DATA_PATH}/${path}`);
}

export function getValuesWithPaths(obj, key, arr = []) {
    let objects = [];
    Object.keys(obj).forEach(i => {
        if (typeof obj[i] === 'object') {
            objects = objects.concat(this.getValuesWithPaths(obj[i], key, [...arr, i]));
        } else if (i === key) {
            objects.push({ [obj[i]]: arr });
        }
    });
    return objects;
}

export function getParams(query) {
    return query
        ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
              const [key, value] = param.split('=');
              params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
              return params;
          }, {})
        : {};
}
