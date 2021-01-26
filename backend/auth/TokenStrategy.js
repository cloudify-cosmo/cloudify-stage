/**
 * Created by edenp on 7/30/17.
 */

const UniqueTokenStrategy = require('passport-unique-token').Strategy;
const AuthHandler = require('../handler/AuthHandler');
const LoggerHandler = require('../handler/LoggerHandler');

const logger = LoggerHandler.getLogger('Passport');

module.exports = () => {
    return new UniqueTokenStrategy(
        {
            tokenHeader: 'authentication-token'
        },
        (token, done) => {
            AuthHandler.getUser(token)
                .then(user => {
                    return done(null, user);
                })
                .catch(error => {
                    logger.debug('Cannot get user', error);
                    return done(null, false, error);
                });
        }
    );
};
