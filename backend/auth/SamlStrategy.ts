import type { VerifyWithoutRequest } from '@node-saml/passport-saml';
import { Strategy } from '@node-saml/passport-saml';
import type { Strategy as PassportStrategy } from 'passport';
import fs from 'fs';
import { noop } from 'lodash';
import { getConfig } from '../config';

export default () => {
    let cert;
    try {
        cert = fs.readFileSync(getConfig().app.auth.certPath, 'utf-8');
    } catch (e) {
        throw new Error('Could not read SAML certificate [auth.certPath]');
    }

    const signonVerify: VerifyWithoutRequest = (user, done) => done(null, user!);

    return new Strategy(
        {
            path: '/auth/saml/callback',
            entryPoint: getConfig().app.auth.loginPageUrl,
            cert,
            issuer: 'onelogin_saml'
        },
        signonVerify,
        noop
    ) as unknown as PassportStrategy;
};
