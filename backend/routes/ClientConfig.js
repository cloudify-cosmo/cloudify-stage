/**
 * Created by kinneretzin on 08/03/2017.
 */

var express = require('express');
var request = require('request');
var db = require('../db/Connection');
var router = express.Router();
var bodyParser = require('body-parser');

var logger = require('log4js').getLogger('ClientConfigRouter');

router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/:ip',function (req, res,next) {
    db.ClientConfig
        .findOrCreate({ where: {managerIp: req.params.ip}, defaults: {config: {canUserEdit: true}}})
        .then(function(clientConfig) {
            res.send(clientConfig[0]);
        })
        .catch(next);
});

router.post('/:ip',function (req, res,next) {
    db.ClientConfig
        .findOrCreate({ where: {managerIp: req.params.ip}, defaults: {config: {canUserEdit: true}}})
        .spread(function(clientConfig, created) {
            clientConfig.update({ config: req.body}, {fields: ['config']}).then(function(c) {
                res.send(c);
            })
        })
        .catch(next);
});

module.exports = router;
