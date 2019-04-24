'use strict';
/**
 * Created by jakubniezgoda on 13/09/2017.
 */

var express = require('express');
var passport = require('passport');

var BackendHandler = require('../handler/BackendHandler');
var logger = require('../handler/LoggerHandler').getLogger('WidgetBackend');
var router = express.Router();

router.use(passport.authenticate('token', {session: false}));

router.use('/:service', function(req, res, next) {
    logger.debug(`${req.method} request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`);
    return BackendHandler.callService(req.params.service, req.method, req, res, next)
        .catch(next);
});

module.exports = router;
