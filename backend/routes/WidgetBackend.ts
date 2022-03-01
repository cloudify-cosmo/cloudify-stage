import express from 'express';
import { callService } from '../handler/BackendHandler';
import { getLogger } from '../handler/LoggerHandler';
import type { AllowedRequestMethod } from '../types';

const logger = getLogger('WidgetBackend');
const router = express.Router();

router.use('/:service', (req, res, next) => {
    logger.debug(
        `${req.method} request on service '${req.params.service}' called with parameters: ${JSON.stringify(req.query)}`
    );
    return callService(req.params.service, req.method as AllowedRequestMethod, req, res, next).catch(next);
});

export default router;
