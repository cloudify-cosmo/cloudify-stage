/**
 * Created by kinneretzin on 13/02/2017.
 */
var express = require('express');
var request = require('request');
var db = require('../db/Connection');
var router = express.Router();
var bodyParser = require('body-parser');
var AuthMiddleware = require('./AuthMiddleware');

var logger = require('log4js').getLogger('UserAppRouter');
var ServerSettings = require('../serverSettings');
var config = require('../config').get();

router.use(AuthMiddleware);
router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/:username/:role', function (req, res, next) {
    db.UserApp
        .findOne({ where: {
            managerIp: config.manager.ip,
            username: req.params.username,
            role: req.params.role,
            mode: ServerSettings.settings.mode,
            tenant: req.headers.tenant
        } }).then(function(userApp) {
            res.send(userApp || {});
        })
        .catch(next);
});

router.post('/:username/:role', function (req, res, next) {
    db.UserApp
        .findOrCreate({ where: {
            managerIp: config.manager.ip,
            username: req.params.username,
            role: req.params.role,
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
