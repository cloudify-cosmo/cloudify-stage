/**
 * Created by edenp on 07/09/2017.
 */
'use strict';

var logger = require('log4js').getLogger('SAML');


exports.validate = (samlConfig) => {
    if (!samlConfig.certPath) {
        logger.error('SAML is enabled, yet certificate path was not configured. [saml.certPath]');
        process.exit(1);
    }

    if (!samlConfig.ssoUrl) {
        logger.error('SAML is enabled, yet identity provider single sign on Url was not configured. [saml.ssoUrl]');
        process.exit(1);
    }

    if (!samlConfig.portalUrl) {
        logger.error('SAML is enabled, yet the organization portal url was not configured. [saml.portalUrl]');
        process.exit(1);
    }
};