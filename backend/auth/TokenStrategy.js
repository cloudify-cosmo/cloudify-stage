/**
 * Created by edenp on 7/30/17.
 */

const UniqueTokenStrategy = require('passport-unique-token').Strategy;
const AuthHandler = require('../handler/AuthHandler');

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
