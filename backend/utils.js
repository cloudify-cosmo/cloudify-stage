/**
 * Created by jakub.niezgoda on 13/07/2018.
 */

const pathlib = require('path');

const Consts = require('./consts');

const isDevelopmentOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

module.exports = {
    isDevelopmentOrTest,

    getResourcePath: (path, isUserData) => {
        if (isDevelopmentOrTest) {
            // TODO(RD-1402): use a temporary directory during tests
            return pathlib.resolve(`..${isUserData ? Consts.USER_DATA_PATH : ''}/${path}`);
        }
        return pathlib.resolve(`../dist/${isUserData ? Consts.USER_DATA_PATH : Consts.APP_DATA_PATH}/${path}`);
    },

    getValuesWithPaths(obj, key, arr = []) {
        let objects = [];
        Object.keys(obj).forEach(i => {
            if (typeof obj[i] === 'object') {
                objects = objects.concat(this.getValuesWithPaths(obj[i], key, [...arr, i]));
            } else if (i === key) {
                objects.push({ [obj[i]]: arr });
            }
        });
        return objects;
    },

    getParams(query) {
        return query
            ? (/^[?#]/.test(query) ? query.slice(1) : query).split('&').reduce((params, param) => {
                  const [key, value] = param.split('=');
                  params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                  return params;
              }, {})
            : {};
    }
};
