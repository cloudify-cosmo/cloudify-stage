import _ from 'lodash';
import { EDITION } from '../consts';
import { jsonRequest } from './ManagerHandler';

import { getMode, setMode, MODE_MAIN, MODE_COMMUNITY } from '../serverSettings';
import { getLogger } from './LoggerHandler';

const logger = getLogger('AuthHandler');

let authorizationCache = {} as ConfigResponse['authorization'];

export interface TokenResponse {
    username: string;
    value: string;
    role: string;
}

export interface ConfigResponse {
    metadata: any;
    items: any[];
    authorization: {
        roles: {
            id: number;
            name: string;
            type: string;
            description: string;
        }[];
        permissions: Record<string, string[]>[];
    };
}

export interface VersionResponse {
    edition: typeof EDITION.PREMIUM | typeof EDITION.COMMUNITY;
    version: string;
    build: any;
    date: any;
    commit: any;
    distribution: string;
    // eslint-disable-next-line camelcase
    distro_release: string;
}

export function getToken(basicAuth: string) {
    return jsonRequest<TokenResponse>('GET', '/tokens', {
        Authorization: basicAuth
    });
}

export function getTenants(token: string) {
    return jsonRequest('GET', '/tenants?_get_all_results=true&_include=name', {
        'Authentication-Token': token
    });
}

export function getUser(token: string) {
    return jsonRequest('GET', '/user?_get_data=true', {
        'Authentication-Token': token
    });
}

export function isProductLicensed(version: VersionResponse) {
    return !_.isEqual(version.edition, EDITION.COMMUNITY);
}

export function getLicense(token: string) {
    return jsonRequest('GET', '/license', {
        'Authentication-Token': token
    });
}

export function getTokenViaSamlResponse(samlResponse: string) {
    return jsonRequest<TokenResponse>(
        'POST',
        '/tokens',
        {},
        {
            'saml-response': samlResponse
        }
    );
}

export function getAndCacheConfig(token?: string) {
    return jsonRequest<ConfigResponse>('GET', '/config', {
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
    return jsonRequest<VersionResponse>('GET', '/version', { 'Authentication-Token': token }).then(version => {
        // set community mode from manager API only if mode is not set from the command line
        if (getMode() === MODE_MAIN && version.edition === MODE_COMMUNITY) {
            setMode(MODE_COMMUNITY);
        }

        return Promise.resolve(version);
    });
}

export function isAuthorized(user: Express.User, authorizedRoles: string[]) {
    const systemRole = user.role;
    const groupSystemRoles = _.keys(user.group_system_roles);

    const userSystemRoles = _.uniq(_.concat(systemRole, groupSystemRoles));
    return _.intersection(userSystemRoles, authorizedRoles).length > 0;
}
