/**
 * Created by jakubniezgoda on 13/09/2017.
 */

const express = require('express');
const passport = require('passport');

const BackendHandler = require('../handler/BackendHandler');
const logger = require('../handler/LoggerHandler').getLogger('WidgetBackend');

const router = express.Router();

router.use(passport.authenticate('token', { session: false }));

router.use('/:service', function(req, res, next) {
    logger.debug(
        `${req.method} request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`
    );
    return BackendHandler.callService(req.params.service, req.method, req, res, next).catch(next);
});

module.exports = router;
