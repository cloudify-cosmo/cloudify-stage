// @ts-nocheck File not migrated fully to TS

import express from 'express';
import passport from 'passport';

import { callService } from '../handler/BackendHandler';

import { getLogger } from '../handler/LoggerHandler';

const logger = getLogger('WidgetBackend');

const router = express.Router();

router.use('/:service', (req, res, next) => {
    logger.debug(
        `${req.method} request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`
    );
    return callService(req.params.service, req.method, req, res, next).catch(next);
});

export default router;
