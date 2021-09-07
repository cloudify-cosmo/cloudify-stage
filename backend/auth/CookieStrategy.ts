// @ts-nocheck File not migrated fully to TS
import { Strategy } from 'passport-cookie';
import { getUser } from '../handler/AuthHandler';
import { TOKEN_COOKIE_NAME } from '../consts';

export default () => {
    return new Strategy({ cookieName: TOKEN_COOKIE_NAME }, (token, done) =>
        getUser(token)
            .then(user => done(null, user))
            .catch(err => done(null, false, err + token))
    );
};
