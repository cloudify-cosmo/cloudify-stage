/**
 * Created by edenp on 7/30/17.
 */
'use strict';
var config = require('../config').get();
var ManagerHandler = require('./ManagerHandler');


class AuthHandler {
    static getToken(username, password){
        var buffer = new Buffer(`${username}:${password}`).toString('base64');
        var auth = 'Basic '+ buffer;
        return ManagerHandler.jsonRequest('GET', '/tokens', {
                'Authorization': auth
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
    };
}

module.exports = AuthHandler;