import validateAuthConfig from 'validateAuthConfig';

describe('validateAuthConfig', () => {
    it('should validate SAML authentication config', () => {
        expect(() => validateAuthConfig({ type: 'saml' })).toThrowError(
            'SAML authentication is enabled, yet certificate path was not configured. [auth.certPath]'
        );
        expect(() => validateAuthConfig({ type: 'saml', certPath: 'x' })).toThrowError(
            'External authentication is enabled, yet identity provider single sign on Url was not configured. [auth.ssoUrl]'
        );
        expect(() => validateAuthConfig({ type: 'saml', certPath: 'x', ssoUrl: 'x' })).toThrowError(
            'External authentication is enabled, yet the organization portal url was not configured. [auth.portalUrl]'
        );
        expect(() =>
            validateAuthConfig({ type: 'saml', certPath: 'x', ssoUrl: 'x', portalUrl: 'x' })
        ).not.toThrowError();
    });

    it('should validate local authentication config', () => {
        expect(() => validateAuthConfig({ type: 'local' })).not.toThrowError();
    });

    it('should validate any external authentication config', () => {
        expect(() => validateAuthConfig({ type: 'any' })).toThrowError(
            'External authentication is enabled, yet identity provider single sign on Url was not configured. [auth.ssoUrl]'
        );
        expect(() => validateAuthConfig({ type: 'any', ssoUrl: 'x' })).toThrowError(
            'External authentication is enabled, yet the organization portal url was not configured. [auth.portalUrl]'
        );
    });
});
