/**
 * Created by edenp on 7/30/17.
 */

const _ = require('lodash');
const Consts = require('../consts');
const ManagerHandler = require('./ManagerHandler');

let ServerSettings = require('../serverSettings');
let logger = require('./LoggerHandler').getLogger('AuthHandler');
let authorizationCache = {};

class AuthHandler {
    static getToken(basicAuth) {
        return ManagerHandler.jsonRequest('GET', '/tokens', {
            'Authorization': basicAuth
        });
    }

    static getTenants(token) {
        return ManagerHandler.jsonRequest('GET', '/tenants?_get_all_results=true&_include=name', {
            'Authentication-Token': token
        });
    }

    static getUser(token) {
        return ManagerHandler.jsonRequest('GET', '/user?_get_data=true', {
            'Authentication-Token': token
        });
    }

    static isProductLicensed(version) {
        return !_.isEqual(version.edition, Consts.EDITION.COMMUNITY);
    }

    static getLicense(token) {
        return ManagerHandler.jsonRequest('GET', '/license', {
            'Authentication-Token': token
        });
    }

    static getTokenViaSamlResponse(samlResponse) {
        return ManagerHandler.jsonRequest('POST', '/tokens', null, {
            'saml-response': samlResponse
        });
    }

    static getAndCacheConfig(token) {
        return ManagerHandler.jsonRequest('GET', '/config', {
            'Authentication-Token': token
        })
        .then(config => {
            authorizationCache = config.authorization;
            logger.debug('Authorization config cached successfully.');
            return Promise.resolve(authorizationCache);
        })
    }

    static isRbacInCache() {
        return !_.isEmpty(authorizationCache);
    }

    static async getRBAC(token) {
        if (!AuthHandler.isRbacInCache()) {
            logger.debug('No RBAC data in cache.');
            return await AuthHandler.getAndCacheConfig(token);
        } else {
            logger.debug('RBAC data found in cache.');
            return authorizationCache;
        }
    }

    static getManagerVersion(token) {
        return ManagerHandler.jsonRequest('GET', '/version', {'Authentication-Token': token})
            .then((version) => {
                //set community mode from manager API only if mode is not set from the command line
                if (ServerSettings.settings.mode === ServerSettings.MODE_MAIN
                    && version.edition === ServerSettings.MODE_COMMUNITY) {
                    ServerSettings.settings.mode = ServerSettings.MODE_COMMUNITY;
                }

                return Promise.resolve(version);
            });
    }

    static isAuthorized(user, authorizedRoles) {
        var systemRole = user.role;
        var groupSystemRoles = _.keys(user.group_system_roles);

        var userSystemRoles = _.uniq(_.concat(systemRole, groupSystemRoles));
        return _.intersection(userSystemRoles, authorizedRoles).length > 0;
    }
}

module.exports = AuthHandler;