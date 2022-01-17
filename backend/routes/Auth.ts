// @ts-nocheck File not migrated fully to TS

import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import _ from 'lodash';

import * as AuthHandler from '../handler/AuthHandler';
import { CONTEXT_PATH, ROLE_COOKIE_NAME, TOKEN_COOKIE_NAME, USERNAME_COOKIE_NAME } from '../consts';
import { getConfig } from '../config';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('Auth');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

function getCookieOptions(req) {
    const httpsUsed = req.header('X-Scheme')?.includes('https');
    return { sameSite: 'strict', secure: httpsUsed };
}

router.post('/login', (req, res) =>
    AuthHandler.getToken(req.headers.authorization)
        .then(token => {
            const cookieOptions = getCookieOptions(req);
            res.cookie(TOKEN_COOKIE_NAME, token.value, cookieOptions);
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

router.post('/saml/callback', passport.authenticate('saml', { session: false }), (req, res) => {
    if (!req.body || !req.body.SAMLResponse || !req.user) {
        res.status(401).send({ message: 'Invalid Request' });
    } else {
        logger.debug('Received SAML Response for user', req.user);
        AuthHandler.getTokenViaSamlResponse(req.body.SAMLResponse)
            .then(token => {
                const cookieOptions = getCookieOptions(req);
                res.cookie(TOKEN_COOKIE_NAME, token.value, cookieOptions);
                res.cookie(USERNAME_COOKIE_NAME, req.user.username, cookieOptions);
                res.cookie(ROLE_COOKIE_NAME, token.role, cookieOptions);
                res.redirect(CONTEXT_PATH);
            })
            .catch(err => {
                logger.error(err);
                res.status(500).send({ message: 'Failed to authenticate with manager' });
            });
    }
});

router.get('/manager', (req, res) => {
    const token = req.headers['authentication-token'];
    const isSamlEnabled = _.get(getConfig(), 'app.saml.enabled', false);
    if (isSamlEnabled) {
        res.clearCookie(USERNAME_COOKIE_NAME);
        res.clearCookie(ROLE_COOKIE_NAME);
    }
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

router.get('/user', passport.authenticate('token', { session: false }), (req, res) => {
    res.send({
        username: req.user.username,
        role: req.user.role,
        groupSystemRoles: req.user.group_system_roles,
        tenantsRoles: req.user.tenants
    });
});

router.post('/logout', passport.authenticate('token', { session: false }), (req, res) => {
    res.clearCookie(TOKEN_COOKIE_NAME);
    res.end();
});

router.get('/RBAC', passport.authenticate('token', { session: false }), (req, res) => {
    AuthHandler.getRBAC(req.headers['authentication-token'])
        .then(res.send)
        .catch(err => {
            logger.error(err);
            res.status(500).send({ message: 'Failed to get RBAC configuration', error: err });
        });
});

export default router;
