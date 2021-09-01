// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import { EDITION } from '../consts';
import { jsonRequest } from './ManagerHandler';

import { getMode, setMode, MODE_MAIN, MODE_COMMUNITY } from '../serverSettings';
import { getLogger } from './LoggerHandler';

const logger = getLogger('AuthHandler');

let authorizationCache = {};

export function getToken(basicAuth) {
    return jsonRequest('GET', '/tokens', {
        Authorization: basicAuth
    });
}

export function getTenants(token) {
    return jsonRequest('GET', '/tenants?_get_all_results=true&_include=name', {
        'Authentication-Token': token
    });
}

export function getUser(token) {
    return jsonRequest('GET', '/user?_get_data=true', {
        'Authentication-Token': token
    });
}

export function isProductLicensed(version) {
    return !_.isEqual(version.edition, EDITION.COMMUNITY);
}

export function getLicense(token) {
    return jsonRequest('GET', '/license', {
        'Authentication-Token': token
    });
}

export function getTokenViaSamlResponse(samlResponse) {
    return jsonRequest('POST', '/tokens', null, {
        'saml-response': samlResponse
    });
}

export function getAndCacheConfig(token) {
    return jsonRequest('GET', '/config', {
        'Authentication-Token': token
    }).then(config => {
        authorizationCache = config.authorization;
        logger.debug('Authorization config cached successfully.');
        return Promise.resolve(authorizationCache);
    });
}

export function isRbacInCache() {
    return !_.isEmpty(authorizationCache);
}

export async function getRBAC(token) {
    if (!isRbacInCache()) {
        logger.debug('No RBAC data in cache.');
        await getAndCacheConfig(token);
    } else {
        logger.debug('RBAC data found in cache.');
    }
    return authorizationCache;
}

export function getManagerVersion(token) {
    return jsonRequest('GET', '/version', { 'Authentication-Token': token }).then(version => {
        // set community mode from manager API only if mode is not set from the command line
        if (getMode() === MODE_MAIN && version.edition === MODE_COMMUNITY) {
            setMode(MODE_COMMUNITY);
        }

        return Promise.resolve(version);
    });
}

export function isAuthorized(user, authorizedRoles) {
    const systemRole = user.role;
    const groupSystemRoles = _.keys(user.group_system_roles);

    const userSystemRoles = _.uniq(_.concat(systemRole, groupSystemRoles));
    return _.intersection(userSystemRoles, authorizedRoles).length > 0;
}
