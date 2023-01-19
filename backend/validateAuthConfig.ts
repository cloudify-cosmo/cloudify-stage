import type { Config } from './routes/Config.types';

const supportedAuthTypes = ['local', 'saml', 'saas'];

export default function validateAuthConfig(authConfig: Partial<Config['app']['auth']>) {
    if (!authConfig.type || !supportedAuthTypes.includes(authConfig.type)) {
        throw new Error(
            'Authentication type was not configured properly. ' +
                'Supported types are "local", "saml" and "saas". [auth.type]'
        );
    }

    if (authConfig.type === 'saml' && !authConfig.certPath) {
        throw new Error('SAML authentication is enabled, yet certificate path was not configured. [auth.certPath]');
    }

    if (!authConfig.loginPageUrl) {
        throw new Error('Login page URL was not configured. [auth.loginPageUrl]');
    }

    if (!authConfig.logoutRedirectUrl) {
        throw new Error('Logout redirection URL was not configured. [auth.logoutRedirectUrl]');
    }
}
