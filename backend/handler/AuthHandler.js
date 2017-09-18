/**
 * Created by edenp on 7/30/17.
 */
'use strict';
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');


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
        return ManagerHandler.jsonRequest('POST', '/tokens', {
                Tenant: 'defualt_tenant'
            },
            {'saml-response': samlResponse}
        );
    }

}

module.exports = AuthHandler;