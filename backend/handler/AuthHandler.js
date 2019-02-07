/**
 * Created by edenp on 7/30/17.
 */

let ManagerHandler = require('./ManagerHandler');
let logger = require('log4js').getLogger('AuthHandler');
let _ = require('lodash');
let ServerSettings = require('../serverSettings');

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
            return Promise.resolve(config);
        })
    }

    static isRbacInCache() {
        return !_.isEmpty(authorizationCache);
    }

    static getRBAC() {
        if (!AuthHandler.isRbacInCache()) {
            logger.error('No RBAC data in cache.');
        }

        return authorizationCache;
    }

    static getManagerVersion(token) {
        return ManagerHandler.jsonRequest('GET', '/version', {'Authentication-Token': token})
            .then((version) => {
                //set community mode from manager API only if mode is not set from the command line
                if (ServerSettings.settings.mode === ServerSettings.MODE_MAIN
                    && version.edition === ServerSettings.MODE_COMMUNITY) {
                    ServerSettings.settings.mode = ServerSettings.MODE_COMMUNITY;
                }

                return Promise.resolve(version.version);
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