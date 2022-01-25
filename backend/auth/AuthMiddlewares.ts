import passport from 'passport';
import type { Request, Response, NextFunction } from 'express';

type AuthenticateMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => ReturnType<ReturnType<typeof authenticateWith>>;

function authenticateWith(strategy: 'cookie' | 'token' | 'saml') {
    return passport.authenticate(strategy, { session: false });
}
export const authenticateWithCookie: AuthenticateMiddleware = (req, res, next) => {
    return authenticateWith('cookie')(req, res, next);
};

export const authenticateWithToken: AuthenticateMiddleware = (req, res, next) => {
    return authenticateWith('token')(req, res, next);
};

export const authenticateWithSaml: AuthenticateMiddleware = (req, res, next) => {
    return authenticateWith('saml')(req, res, next);
};
