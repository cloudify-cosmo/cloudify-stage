/**
 * Created by edenp on 7/30/17.
 */
'use strict';

var config = require('../config').get();
var db = require('../db/Connection');
var ManagerHandler = require('../handler/ManagerHandler');
var UniqueTokenStrategy = require('passport-unique-token').Strategy;
var AuthHandler = require('../handler/AuthHandler');

module.exports = () => {
    return new UniqueTokenStrategy({
            tokenHeader: 'authentication-token'
        }, (token, done) => {
            AuthHandler.getUser(token).then((user) => {
                return done(null, user);
            })
            .catch((err) => {
                return done(null, false, err);
            });
    });
};
