import passport from 'passport';
import type { Request, Response, NextFunction } from 'express';

function authenticateWith(strategy: 'cookie' | 'token' | 'saml') {
    return passport.authenticate(strategy, { session: false });
}
export function authenticateWithCookie(req: Request, res: Response, next: NextFunction) {
    return authenticateWith('cookie')(req, res, next);
}

export function authenticateWithToken(req: Request, res: Response, next: NextFunction) {
    return authenticateWith('token')(req, res, next);
}

export function authenticateWithSaml(req: Request, res: Response, next: NextFunction) {
    return authenticateWith('token')(req, res, next);
}
