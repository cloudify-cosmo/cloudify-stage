/**
 * Created by edenp on 7/30/17.
 */
'use strict';

var config = require('../config').get();
var SamlStrategy = require('passport-saml').Strategy;
var fs = require('fs');
var logger = require('log4js').getLogger('SAML');


module.exports = () => {
    try{
        var cert = fs.readFileSync(config.app.saml.certPath, 'utf-8');
    }
    catch(e){
        logger.error('Could not read SAML certificate [saml.certPath]', e);
        process.exit(1);
    }

    return new SamlStrategy(
        {
            path: '/auth/saml/callback',
            entryPoint: config.app.saml.ssoUrl,
            cert: cert
        },
        function (user, done) {
            return done(null, user);
        }
    );
};
