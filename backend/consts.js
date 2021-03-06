/**
 * Created by jakubniezgoda on 07/11/2017.
 */
const _ = require('lodash');

module.exports = {
    ALLOWED_METHODS_OBJECT: { get: 'GET', post: 'POST', put: 'PUT', delete: 'DELETE', patch: 'PATCH' },

    CONTEXT_PATH: '/console',

    USER_DATA_PATH: '/userData',
    APP_DATA_PATH: '/appData',

    WIDGET_ID_HEADER: 'widget-id',
    TOKEN_COOKIE_NAME: 'XSRF-TOKEN',
    ROLE_COOKIE_NAME: 'ROLE',
    USERNAME_COOKIE_NAME: 'USERNAME',

    EDITION: {
        PREMIUM: 'premium',
        COMMUNITY: 'community'
    },

    SERVER_HOST: 'localhost',
    SERVER_PORT: 8088,

    LAYOUT: {
        TABS: 'tabs',
        WIDGETS: 'widgets'
    }
};

module.exports.ALLOWED_METHODS_ARRAY = _.values(module.exports.ALLOWED_METHODS_OBJECT);
