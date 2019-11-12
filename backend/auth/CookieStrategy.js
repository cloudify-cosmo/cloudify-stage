/**
 * Created by jakub.niezgoda on 13/07/2018.
 */

const CookieStrategy = require('passport-cookie').Strategy;
const AuthHandler = require('../handler/AuthHandler');
const Consts = require('../consts');

module.exports = () => {
    return new CookieStrategy({ cookieName: Consts.TOKEN_COOKIE_NAME }, (token, done) =>
        AuthHandler.getUser(token)
            .then(user => done(null, user))
            .catch(err => done(null, false, err + token))
    );
};
