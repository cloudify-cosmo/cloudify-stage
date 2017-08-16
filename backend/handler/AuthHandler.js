/**
 * Created by edenp on 7/30/17.
 */
'use strict';
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');


class AuthHandler {
    static getToken(username, password){
        return ManagerHandler.jsonRequest('GET', '/tokens', {
                'Authorization': 'Basic '+Buffer.from(`${username}:${password}`).toString('base64')
            }
        );
    }

    static getTenants(token){
        return ManagerHandler.jsonRequest('GET', '/tenants', {
                'authentication-token': token
            }
        );
    }
}

module.exports = AuthHandler;