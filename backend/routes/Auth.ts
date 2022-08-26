import express from 'express';
import _ from 'lodash';
import type { CookieOptions, Request } from 'express';

import { authenticateWithCookie, authenticateWithSaml } from '../auth/AuthMiddlewares';
import * as AuthHandler from '../handler/AuthHandler';
import { CONTEXT_PATH, EXTERNAL_LOGIN_PATH, TOKEN_COOKIE_NAME } from '../consts';
import { getLogger } from '../handler/LoggerHandler';
import { getTokenFromCookies } from '../utils';
import type { AuthUserResponse } from './Auth.types';
import { db } from '../db/Connection';
import type { UserAppsInstance } from '../db/models/UserAppsModel';

const router = express.Router();
const logger = getLogger('Auth');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

function getCookieOptions(req: Request, httpOnly = true) {
    const httpsUsed = req.header('X-Scheme') === 'https' || req.header('X-Force-Secure') === 'true';
    return { sameSite: 'strict', secure: httpsUsed, httpOnly } as CookieOptions;
}

// This path is used during logging in, so it should not require authentication
router.post('/login', (req, res) =>
    AuthHandler.getToken(req.headers.authorization as string)
        .then(token => {
            const tokenCookieOptions = getCookieOptions(req);
            res.cookie(TOKEN_COOKIE_NAME, token.value, tokenCookieOptions);
            res.send({ role: token.role });
        })
        .catch(err => {
            logger.error(err);
            if (err.error_code === 'unauthorized_error') {
                res.status(401).send({ message: err.message || 'Invalid credentials' });
            } else if (err.error_code === 'maintenance_mode_active') {
                res.status(423).send({ message: 'Manager is currently in maintenance mode' });
            } else {
                res.status(500).send({ message: `Failed to authenticate with manager: ${err.message}` });
            }
        })
);

router.post('/saml/callback', authenticateWithSaml, (req, res) => {
    if (!req.body || !req.body.SAMLResponse || !req.user) {
        res.status(401).send({ message: 'Invalid Request' });
    } else {
        logger.debug('Received SAML Response for user', req.user);
        AuthHandler.getTokenViaSamlResponse(req.body.SAMLResponse)
            .then(token => {
                res.cookie(TOKEN_COOKIE_NAME, token.value, getCookieOptions(req));
                res.redirect(`${CONTEXT_PATH}${EXTERNAL_LOGIN_PATH}`);
            })
            .catch(err => {
                logger.error(err);
                res.status(500).send({ message: 'Failed to authenticate with manager' });
            });
    }
});

router.get('/manager', authenticateWithCookie, (req, res) => {
    const token = getTokenFromCookies(req);
    Promise.all([AuthHandler.getManagerVersion(token), AuthHandler.getAndCacheConfig(token)])
        .then(([version, rbac]) =>
            AuthHandler.isProductLicensed(version)
                ? AuthHandler.getLicense(token).then(data => ({
                      license: _.get(data, 'items[0]', {}),
                      version,
                      rbac
                  }))
                : {
                      license: null,
                      version,
                      rbac
                  }
        )
        .then(data => res.send(data))
        .catch(error => {
            logger.error(error);
            res.status(500).send({ message: 'Failed to get manager data' });
        });
});

router.get('/user', authenticateWithCookie, (req, res) => {
    res.send({
        username: req.user!.username,
        role: req.user!.role,
        groupSystemRoles: req.user!.group_system_roles,
        tenantsRoles: req.user!.tenants,
        showGettingStarted: req.user!.show_getting_started
    } as AuthUserResponse);
});

router.post('/logout', authenticateWithCookie, (_req, res) => {
    res.clearCookie(TOKEN_COOKIE_NAME);
    res.end();
});

router.get('/RBAC', authenticateWithCookie, (req, res) => {
    AuthHandler.getRBAC(getTokenFromCookies(req))
        .then(res.send)
        .catch(err => {
            logger.error(err);
            res.status(500).send({ message: 'Failed to get RBAC configuration', error: err });
        });
});

router.get('/first-login', (_req, res, next) => {
    db.UserApps.findAll<UserAppsInstance>()
        .then(userApp => res.send(_.isEmpty(userApp)))
        .catch(next);
});

export default router;
