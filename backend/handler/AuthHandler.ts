import _ from 'lodash';
import { EDITION } from '../consts';
import { jsonRequest } from './ManagerHandler';

import { getMode, setMode, MODE_MAIN, MODE_COMMUNITY } from '../serverSettings';
import { getLogger } from './LoggerHandler';
import type { ConfigResponse, TokenResponse, UserResponse, VersionResponse } from '../routes/Auth.types';
import { getAuthenticationTokenHeaderFromToken } from '../utils';

const logger = getLogger('AuthHandler');

const tokenRequestPayload = {
    description: 'UI authentication token',
    expiration_date: '+10h'
};
let authorizationCache = {} as ConfigResponse['authorization'];

export function getToken(basicAuth: string) {
    return jsonRequest<TokenResponse>(
        'POST',
        '/tokens',
        {
            Authorization: basicAuth
        },
        tokenRequestPayload
    );
}

export function getTenants(token: string) {
    return jsonRequest(
        'GET',
        '/tenants?_get_all_results=true&_include=name',
        getAuthenticationTokenHeaderFromToken(token)
    );
}

export function getUser(token: string): Promise<UserResponse> {
    return jsonRequest('GET', '/user?_get_data=true', getAuthenticationTokenHeaderFromToken(token));
}

export function isProductLicensed(version: VersionResponse) {
    return !_.isEqual(version.edition, EDITION.COMMUNITY);
}

export function getLicense(token: string) {
    return jsonRequest('GET', '/license', getAuthenticationTokenHeaderFromToken(token));
}

export function getTokenViaSamlResponse(samlResponse: string) {
    return jsonRequest<TokenResponse>(
        'POST',
        '/tokens',
        {},
        {
            'saml-response': samlResponse,
            ...tokenRequestPayload
        }
    );
}

export function getAndCacheConfig(token: string) {
    return jsonRequest<ConfigResponse>('GET', '/config', getAuthenticationTokenHeaderFromToken(token)).then(config => {
        authorizationCache = config.authorization;
        logger.debug('Authorization config cached successfully.');
        return Promise.resolve(authorizationCache);
    });
}

export function isRbacInCache() {
    return !_.isEmpty(authorizationCache);
}

export async function getRBAC(token: string): Promise<{ roles: any }> {
    if (!isRbacInCache()) {
        logger.debug('No RBAC data in cache.');
        await getAndCacheConfig(token);
    } else {
        logger.debug('RBAC data found in cache.');
    }
    return authorizationCache;
}

export function getManagerVersion(token: string) {
    return jsonRequest<VersionResponse>('GET', '/version', getAuthenticationTokenHeaderFromToken(token)).then(
        version => {
            // set community mode from manager API only if mode is not set from the command line
            if (getMode() === MODE_MAIN && version.edition === MODE_COMMUNITY) {
                setMode(MODE_COMMUNITY);
            }

            return Promise.resolve(version);
        }
    );
}

export function isAuthorized(user: Express.User, authorizedRoles: string[]) {
    const systemRole = user.role;
    const groupSystemRoles = _.keys(user.group_system_roles);

    const userSystemRoles = _.uniq(_.concat(systemRole, groupSystemRoles));
    return _.intersection(userSystemRoles, authorizedRoles).length > 0;
}
