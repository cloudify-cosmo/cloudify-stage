/**
 * Created by edenp on 7/30/17.
 */

const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs');
const config = require('../config').get();

module.exports = () => {
    let cert;
    try {
        cert = fs.readFileSync(config.app.saml.certPath, 'utf-8');
    } catch (e) {
        throw new Error('Could not read SAML certificate [saml.certPath]', e);
    }

    return new SamlStrategy(
        {
            path: '/auth/saml/callback',
            entryPoint: config.app.saml.ssoUrl,
            cert
        },
        (user, done) => done(null, user)
    );
};
