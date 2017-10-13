/**
 * Created by edenp on 7/30/17.
 */
'use strict';
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');
var logger = require('log4js').getLogger('AuthHandler');
var fs = require('fs');
var _ = require('lodash');

var authorizationCache = {};

class AuthHandler {
    static getToken(basicAuth){
        return ManagerHandler.jsonRequest('GET', '/tokens', {
                'Authorization': basicAuth
            }
        );
    }

    static getTenants(token){
        return ManagerHandler.jsonRequest('GET', '/tenants', {
                'authentication-token': token
            }
        );
    }

    static getUser(token){
        return ManagerHandler.jsonRequest('GET', '/user', {
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
            var restSecurity = {};
            try {
                var restSecurityFile = fs.readFileSync(config.manager.restSecurityFile);
                restSecurity = JSON.parse(restSecurityFile);
            } catch (e) {
                logger.error('Could not setup authorization, error loading rest-security file. Please check your manager.json configuration, make sure "restSecurityFile" is set properly', e);
                process.exit(1);
            }

            // Read the authorization info
            var authorization = 'Basic ' + new Buffer(`${restSecurity.admin_username}:${restSecurity.admin_password}`).toString('base64');
            ManagerHandler.jsonRequest('GET', '/config', {
                'Authorization': authorization
            }).then(authConfig => {
                authorizationCache = authConfig.authorization;
                logger.debug('Authorization config loaded successfully: ',authorizationCache);
                resolve();
            }).catch(err => {
                logger.error('Failed to fetch auth config. Error: ',err);
                process.exit(1);
            })
        });
    }

    static getRBAC() {
        return authorizationCache;
    }

}

module.exports = AuthHandler;