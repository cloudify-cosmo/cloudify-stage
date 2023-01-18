import Strategy from 'passport-unique-token';
import { getUser } from '../handler/AuthHandler';
import { getLogger } from '../handler/LoggerHandler';

const logger = getLogger('Passport');

export default () => {
    return new Strategy(
        {
            tokenHeader: 'authentication-token'
        },
        (token, done) => {
            getUser(token)
                .then(user => {
                    return done(null, user);
                })
                .catch(error => {
                    logger.debug('Cannot get user', error);
                    return done(null, false, error);
                });
        }
    );
};
