import validateSamlConfig from 'samlSetup';

describe('SAML Setup', () => {
    it('should validate SAML config', () => {
        expect(() => validateSamlConfig({ enabled: true })).toThrowError(
            'SAML is enabled, yet certificate path was not configured. [saml.certPath]'
        );
        expect(() => validateSamlConfig({ enabled: true, certPath: 'x' })).toThrowError(
            'SAML is enabled, yet identity provider single sign on Url was not configured. [saml.ssoUrl]'
        );
        expect(() => validateSamlConfig({ enabled: true, certPath: 'x', ssoUrl: 'x' })).toThrowError(
            'SAML is enabled, yet the organization portal url was not configured. [saml.portalUrl]'
        );
        expect(() =>
            validateSamlConfig({ enabled: true, certPath: 'x', ssoUrl: 'x', portalUrl: 'x' })
        ).not.toThrowError();
    });
});
