/**
 * Created by jakub.niezgoda on 13/07/2018.
 */

const pathlib = require('path');

const Consts = require('./consts');
const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = {
    getResourcePath: (path, isUserData) => {
        if (isDevelopment) {
            return pathlib.resolve(`..${isUserData ? Consts.USER_DATA_PATH : ''}/${path}`);
        } else {
            return pathlib.resolve(`../dist/${isUserData ? Consts.USER_DATA_PATH : Consts.APP_DATA_PATH}/${path}`);
        }
    },

    getValuesWithPaths: function(obj, key, arr=[]) {
        let objects = [];
        for (let i in obj) {
            if (!obj.hasOwnProperty(i)) continue;
            if (typeof obj[i] === 'object') {
                objects = objects.concat(this.getValuesWithPaths(obj[i], key, [...arr, i]));
            } else if (i === key) {
                objects.push({[obj[i]]: arr});
            }
        }
        return objects;
    },

    getParams: function(query) {
        return query
            ? (/^[?#]/.test(query) ? query.slice(1) : query)
                .split('&')
                .reduce((params, param) => {
                        let [key, value] = param.split('=');
                        params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
                        return params;
                    }, {}
                )
            : {}
    }
};
