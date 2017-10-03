/**
 * Created by edenp on 7/30/17.
 */
'use strict';
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');

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
        //TODO: Please use API to fetch authorisation data once it is available.
        //There is ticket for that: STAGE-503 Use API to fetch authorisation data

        authorizationCache = {
            'roles': [
                {'name': 'admin', 'description': 'Admin role'},
                {'name': 'user', 'description': 'User role'},
            ],
            'permissions': {
                'widget-admin': ['admin'],
                'widget-user': ['admin', 'user'],
                'stage-services-status': ['admin'],
                'stage-edit-mode': ['admin'],
                'stage-maintenance-mode': ['admin'],
                'stage-configure': ['admin'],
                'stage-template-management': ['admin']
            }
        };
    }

    static getRBAC() {
        return authorizationCache;
    }

}

module.exports = AuthHandler;