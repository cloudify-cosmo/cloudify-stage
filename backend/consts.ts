import _ from 'lodash';

const allowedMethods = { get: 'GET', post: 'POST', put: 'PUT', delete: 'DELETE', patch: 'PATCH' };

export const ALLOWED_METHODS_OBJECT = allowedMethods;
export const ALLOWED_METHODS_ARRAY = _.values(allowedMethods);

export const CONTEXT_PATH = '/console';

export const USER_DATA_PATH = '/userData';
export const APP_DATA_PATH = '/appData';

export const WIDGET_ID_HEADER = 'widget-id';
export const TOKEN_COOKIE_NAME = 'XSRF-TOKEN';
export const ROLE_COOKIE_NAME = 'ROLE';
export const USERNAME_COOKIE_NAME = 'USERNAME';

export const EDITION = {
    PREMIUM: 'premium',
    COMMUNITY: 'community'
} as const;

export const SERVER_HOST = 'localhost';
export const SERVER_PORT = 8088;

export const LAYOUT = {
    TABS: 'tabs',
    WIDGETS: 'widgets'
};
