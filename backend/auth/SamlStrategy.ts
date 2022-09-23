import { Strategy } from 'passport-saml';
import type { Strategy as PassportStrategy } from 'passport';
import type { VerifyWithoutRequest } from 'passport-saml';
import fs from 'fs';
import { getConfig } from '../config';

export default () => {
    let cert;
    try {
        cert = fs.readFileSync(getConfig().app.saml.certPath, 'utf-8');
    } catch (e) {
        throw new Error('Could not read SAML certificate [saml.certPath]');
    }

    return new Strategy(
        {
            path: '/auth/saml/callback',
            entryPoint: getConfig().app.saml.ssoUrl,
            cert
        },
        ((user, done) => done(null, user!)) as VerifyWithoutRequest
    ) as PassportStrategy;
};
