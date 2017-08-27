/**
 * Created by edenp on 7/30/17.
 */

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var db = require('../db/Connection');
var passport = require('passport');
var config = require('../config').get();
var AuthHandler = require('../handler/AuthHandler');
var logger = require('log4js').getLogger('ClientConfigRouter');

router.use(bodyParser.json());

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    AuthHandler.getToken(username, password).then((token) => {
        AuthHandler.getTenants(token.value).then((tenants) => {
            if(!!tenants && !!tenants.items && tenants.items.length > 0) {
                res.cookie('XSRF-TOKEN', token.value);
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
        if(err === 'UNAUTHORIZED'){
            res.status(401).send({message: 'Invalid credentials', error: err});
        }
        res.status(500).send({message: 'Failed to authenticate with manager', error: err});
    });
});

router.get('/user', passport.authenticate('token', {session: false}), (req, res) => {
    res.send({
        username: req.user.username,
        role: req.user.role,
        serverVersion: config.manager.serverVersion
    })
});

router.post('/logout', passport.authenticate('token', {session: false}), (req, res) => {
    res.clearCookie('XSRF-TOKEN');
    res.end();
});

module.exports = router;