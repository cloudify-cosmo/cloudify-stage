import { Strategy } from 'passport-cookie';
import { getUser } from '../handler/AuthHandler';
import { TOKEN_COOKIE_NAME } from '../consts';
import LoggerHandler from '../handler/LoggerHandler';

type PassportDoneFunction = (error: any, user: any, info?: any) => any;

const logger = LoggerHandler.getLogger('Passport');

export default () => {
    return new Strategy({ cookieName: TOKEN_COOKIE_NAME }, (token: string, done: PassportDoneFunction) =>
        getUser(token)
            .then(user => done(null, user))
            .catch(err => {
                logger.error(`User authentication failed. Error:`, err);
                return done(null, false, err + token);
            })
    );
};
