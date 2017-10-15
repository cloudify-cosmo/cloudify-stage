
/**
 * Created by kinneretzin on 13/02/2017.
 */
var express = require('express');
var db = require('../db/Connection');
var router = express.Router();
var bodyParser = require('body-parser');
var passport = require('passport');

var ServerSettings = require('../serverSettings');
var config = require('../config').get();

router.use(passport.authenticate('token', {session: false}));
router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', function (req, res, next) {
    db.UserApp
        .findOne({ where: {
            managerIp: config.manager.ip,
            username: req.user.username,
            mode: ServerSettings.settings.mode,
            tenant: req.headers.tenant
        } }).then(function(userApp) {
            res.send(userApp || {});
        })
        .catch(next);
});

router.post('/', function (req, res, next) {
    db.UserApp
        .findOrCreate({ where: {
            managerIp: config.manager.ip,
            username: req.user.username,
            mode: ServerSettings.settings.mode,
            tenant: req.headers.tenant
        }, defaults: {appData: {},appDataVersion:req.body.version}})
        .spread(function(userApp, created) {
            userApp.update({ appData: req.body.appData,appDataVersion:req.body.version}, {fields: ['appData','appDataVersion']}).then(function(ua) {
                res.send(ua);
            })
        })
        .catch(next);
});

module.exports = router;
