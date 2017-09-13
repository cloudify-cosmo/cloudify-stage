'use strict';
/**
 * Created by jakubniezgoda on 13/09/2017.
 */

var express = require('express');
var passport = require('passport');

var logger = require('log4js').getLogger('WidgetBackend');
var router = express.Router();

router.use(passport.authenticate('token', {session: false}));

router.get('/:service', function(req, res, next) {
    logger.debug(`GET request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`);
    
    // TODO
    res.send({});
});

router.post('/:service', function(req, res, next) {
    logger.debug(`POST request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`);
    
    // TODO
    res.send({});
});

router.put('/:service', function(req, res, next) {
    logger.debug(`PUT request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`);
    
    // TODO
    res.send({});
});

router.delete('/:service', function(req, res, next) {
    logger.debug(`DELETE request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`);
    
    // TODO
    res.send({});
});

module.exports = router;
