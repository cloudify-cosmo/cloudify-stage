/**
 * Created by edenp on 7/30/17.
 */
'use strict';

var config = require('../config').get();
var db = require('../db/Connection');
var ManagerHandler = require('../handler/ManagerHandler');

var UniqueTokenStrategy = require('passport-unique-token').Strategy;

var validateToken = (token) =>{
    return ManagerHandler.jsonRequest('GET', '/version', {
            'authentication-token': token
        }
    );
};

module.exports = () => {
    return new UniqueTokenStrategy({
            tokenHeader: 'authentication-token'
        }, (token, done) => {
            db.Users.findOne({where: {managerToken: token}}).then((user) => {
                if(!user){
                    return done(null, false, 'No user found matching token');
                }
                validateToken(token).then(() => {
                    return done(null, user);
                })
                .catch((err) => {
                    return done(null, false, err);
                });
            })
            .catch((err) => {
                return done(null, false, err);
            });
        }
    );
};
