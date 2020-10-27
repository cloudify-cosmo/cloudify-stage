/**
 * Created by edenp on 07/09/2017.
 */

exports.validate = samlConfig => {
    if (!samlConfig.certPath) {
        throw new Error('SAML is enabled, yet certificate path was not configured. [saml.certPath]');
    }

    if (!samlConfig.ssoUrl) {
        throw new Error('SAML is enabled, yet identity provider single sign on Url was not configured. [saml.ssoUrl]');
    }

    if (!samlConfig.portalUrl) {
        throw new Error('SAML is enabled, yet the organization portal url was not configured. [saml.portalUrl]');
    }
};
