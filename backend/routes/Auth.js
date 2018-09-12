/**
 * Created by edenp on 7/30/17.
 */

let express = require('express');
let bodyParser = require('body-parser');
let passport = require('passport');

let db = require('../db/Connection');
let AuthHandler = require('../handler/AuthHandler');
const config = require('../config').get();
const Consts = require('../consts');

let router = express.Router();
let logger = require('log4js').getLogger('Auth');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.post('/login', (req, res) => {
    AuthHandler.getToken(req.headers.authorization).then((token) => {
        AuthHandler.getTenants(token.value).then((tenants) => {
            if(!!tenants && !!tenants.items && tenants.items.length > 0) {
                res.cookie(Consts.TOKEN_COOKIE_NAME, token.value);
                res.send({
                    role: token.role,
                    serverVersion: config.manager.serverVersion
                });
            } else{
                res.status(403).send({message: 'User has no tenants'});
            }
        })
        .catch((err) => {
            logger.error(err);
            res.status(500).send({message: 'Failed to get user tenants', error: err});
        });
    })
    .catch((err) => {
        logger.error(err);
        if(err.error_code === 'unauthorized_error'){
            res.status(401).send({message: err.message || 'Invalid credentials', error: err});
        } else if (err.error_code === 'maintenance_mode_active') {
            res.status(423).send({message: 'Cloudify Manager is currently in maintenance mode', error: err});
        } else {
            res.status(500).send({message: 'Failed to authenticate with manager', error: err});
        }
    });
});

router.post('/saml/callback', passport.authenticate('saml', {session: false}), function (req, res) {
    if (!req.body || !req.body.SAMLResponse || !req.user) {
        res.status(401).send('Invalid Request');
    }

    AuthHandler.getTokenViaSamlResponse(req.body.SAMLResponse).then((token) => {
        res.cookie(Consts.TOKEN_COOKIE_NAME, token.value);
        res.redirect(Consts.CONTEXT_PATH);
    })
    .catch((err) => {
        logger.error(err);
        res.status(500).send({message: 'Failed to authenticate with manager', error: err});
    });

});

router.get('/user', passport.authenticate('token', {session: false}), (req, res) => {
    res.send({
        username: req.user.username,
        role: req.user.role,
        groupSystemRoles: req.user.group_system_roles,
        tenantsRoles: req.user.tenants,
        serverVersion: config.manager.serverVersion
    })
});

router.post('/logout', passport.authenticate('token', {session: false}), (req, res) => {
    res.clearCookie(Consts.TOKEN_COOKIE_NAME);
    res.end();
});

router.get('/RBAC', passport.authenticate('token', {session: false}), (req, res) => {
    res.send(AuthHandler.getRBAC());
});

module.exports = router;