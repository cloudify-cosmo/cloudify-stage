/**
 * Created by edenp on 7/30/17.
 */
'use strict';
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');
var logger = require('log4js').getLogger('AuthHandler');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var ServerSettings = require('../serverSettings');

var authorizationCache = {};
var versionCache = {};

class AuthHandler {
    static getToken(basicAuth){
        return ManagerHandler.jsonRequest('GET', '/tokens', {
                'Authorization': basicAuth
            }
        );
    }

    static getTenants(token){
        return ManagerHandler.jsonRequest('GET', '/tenants?_get_all_results=true&_include=name', {
                'authentication-token': token
            }
        );
    }

    static getVersion(token){
        return ManagerHandler.jsonRequest('GET', '/version', {
                'API-Authentication-Token': token
            }
        );
    }

    static getUser(token){
        return ManagerHandler.jsonRequest('GET', '/user?_get_data=true', {
                'authentication-token': token
            }
        );
    }

    static getTokenViaSamlResponse(samlResponse) {
        return ManagerHandler.jsonRequest('POST', '/tokens', null, {
            'saml-response': samlResponse
        });
    }

    static initAuthorization() {
        return new Promise(function(resolve,reject){
            // Read rest-security file to get system-admin user and pass
            var token = '';
            var tokenPath = path.resolve(__dirname, '../../resources/admin_token');
            try {
                token = fs.readFileSync(tokenPath, 'utf8');
            } catch (err) {
                logger.error(`Could not setup authorization, error loading admin_token file at ${tokenPath}`, err);
                return reject(err);
            }

            // Read the authorization info
            return ManagerHandler.jsonRequest('GET', '/config', {
                'API-Authentication-Token': token
            }).then(authConfig => {
                authorizationCache = authConfig.authorization;
                logger.debug('Authorization config loaded successfully: ',authorizationCache);
                resolve(token);
            }).catch(err => {
                logger.error('Failed to fetch auth config. Error:', err);
                return reject(err);
            })
        }).then((token) => {
            return AuthHandler.getVersion(token).then((version) => {
                versionCache = version;
                logger.debug('Version loaded successfully: ', versionCache);
                //set community mode from manager API only if mode is not set from the command line
                if (ServerSettings.settings.mode === ServerSettings.MODE_MAIN
                    && version.edition === ServerSettings.MODE_COMMUNITY) {
                    ServerSettings.settings.mode = ServerSettings.MODE_COMMUNITY;
                }
            });
        }).catch(err => {
            logger.error('Init authorization error: ', err);
            process.exit(1);
        });
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