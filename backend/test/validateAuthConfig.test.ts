import validateAuthConfig from 'validateAuthConfig';

describe('validateAuthConfig', () => {
    it('should validate SAML authentication config', () => {
        expect(() => validateAuthConfig({ type: 'saml' })).toThrowError(
            'SAML authentication is enabled, yet certificate path was not configured. [auth.certPath]'
        );
        expect(() =>
            validateAuthConfig({ type: 'saml', certPath: 'x', loginPageUrl: 'x', logoutRedirectUrl: 'x' })
        ).not.toThrowError();
    });

    it('should validate supported authentication types', () => {
        expect(() => validateAuthConfig({ type: 'x' })).toThrowError(
            'Authentication type was not configured properly. ' +
                'Supported types are "local", "saml" and "saas". [auth.type]'
        );
    });

    it('should validate login page URL', () => {
        expect(() => validateAuthConfig({ type: 'local' })).toThrowError(
            'Login page URL was not configured. [auth.loginPageUrl]'
        );
    });
    it('should validate logout redirection URL', () => {
        expect(() => validateAuthConfig({ type: 'local', loginPageUrl: '/console/login' })).toThrowError(
            'Logout redirection URL was not configured. [auth.logoutRedirectUrl]'
        );
    });
});
