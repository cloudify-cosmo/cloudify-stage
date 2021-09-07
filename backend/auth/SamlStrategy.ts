// @ts-nocheck File not migrated fully to TS

import { Strategy } from 'passport-saml';
import fs from 'fs';
import { getConfig } from '../config';

export default () => {
    let cert;
    try {
        cert = fs.readFileSync(getConfig().app.saml.certPath, 'utf-8');
    } catch (e) {
        throw new Error('Could not read SAML certificate [saml.certPath]', e);
    }

    return new Strategy(
        {
            path: '/auth/saml/callback',
            entryPoint: getConfig().app.saml.ssoUrl,
            cert
        },
        (user, done) => done(null, user)
    );
};
