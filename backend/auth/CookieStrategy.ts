import { Strategy } from 'passport-cookie';
import { getUser } from '../handler/AuthHandler';
import { TOKEN_COOKIE_NAME } from '../consts';

type PassportDoneFunction = (error: any, user: any, info?: any) => any;

export default () => {
    return new Strategy({ cookieName: TOKEN_COOKIE_NAME }, (token: string, done: PassportDoneFunction) =>
        getUser(token)
            .then(user => done(null, user))
            .catch(err => done(null, false, err + token))
    );
};
