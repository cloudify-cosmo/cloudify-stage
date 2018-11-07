/**
 * Created by edenp on 7/30/17.
 */

var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');
var logger = require('log4js').getLogger('AuthHandler');
var _ = require('lodash');
var ServerSettings = require('../serverSettings');

var authorizationCache = {};
var versionCache = {};

class AuthHandler {
    static getToken(basicAuth){
        return ManagerHandler.jsonRequest('GET', '/tokens', {
            'Authorization': basicAuth
        });
    }

    static getTenants(token){
        return ManagerHandler.jsonRequest('GET', '/tenants?_get_all_results=true&_include=name', {
            'Authentication-Token': token
        });
    }

    static getAndCacheVersion(token){
        return ManagerHandler.jsonRequest('GET', '/version', {
            'Authentication-Token': token
        })
        .then((version) => {
            versionCache = version;
            logger.debug('Version cached successfully.');

            //set community mode from manager API only if mode is not set from the command line
            if (ServerSettings.settings.mode === ServerSettings.MODE_MAIN
                && version.edition === ServerSettings.MODE_COMMUNITY) {
                ServerSettings.settings.mode = ServerSettings.MODE_COMMUNITY;
            }

            return Promise.resolve(version);
        });
    }

    static getUser(token){
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

    static getAndCacheManagerConfig(token) {
        return AuthHandler.getAndCacheConfig(token)
            .then(() => AuthHandler.getAndCacheVersion(token))

    }

    static getRBAC() {
        return authorizationCache;
    }

    static getManagerVersion() {
        return versionCache.version;
    }

    static isAuthorized(user, authorizedRoles) {
        var systemRole = user.role;
        var groupSystemRoles = _.keys(user.group_system_roles);

        var userSystemRoles = _.uniq(_.concat(systemRole, groupSystemRoles));
        return _.intersection(userSystemRoles, authorizedRoles).length > 0;
    }
}

module.exports = AuthHandler;