import type { Config } from './routes/Config.types';

export default function validateAuthConfig(authConfig: Partial<Config['app']['auth']>) {
    if (authConfig.type === 'saml') {
        if (!authConfig.certPath) {
            throw new Error('SAML authentication is enabled, yet certificate path was not configured. [auth.certPath]');
        }
    }

    if (authConfig.type !== 'local') {
        if (!authConfig.ssoUrl) {
            throw new Error(
                'External authentication is enabled, yet identity provider single sign on Url was not configured. [auth.ssoUrl]'
            );
        }

        if (!authConfig.portalUrl) {
            throw new Error(
                'External authentication is enabled, yet the organization portal url was not configured.' +
                    ' [auth.portalUrl]'
            );
        }
    }
}
