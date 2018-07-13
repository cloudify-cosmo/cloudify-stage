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
    }
};
