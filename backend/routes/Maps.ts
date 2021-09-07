// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import express from 'express';
import passport from 'passport';
import request from 'request';

import { getConfig } from '../config';
import { getLogger } from '../handler/LoggerHandler';
import { getMode, MODE_COMMUNITY } from '../serverSettings';

const logger = getLogger('Maps');

const router = express.Router();

function validateEdition(req, res, next) {
    if (getMode() === MODE_COMMUNITY) {
        logger.error(`Endpoint ${req.baseUrl} not available in community edition.`);
        res.sendStatus(403);
    }
    next();
}

router.use(passport.authenticate('cookie', { session: false }));
router.use(validateEdition);

router.get('/:z/:x/:y/:r?', (req, res) => {
    const { x, y, z, r = '' } = req.params;
    const { accessToken, tilesUrlTemplate } = getConfig().app.maps;
    const url = _.template(tilesUrlTemplate)({ x, y, z, r, accessToken });

    logger.debug(`Fetching map tiles from ${tilesUrlTemplate}, x=${x}, y=${y}, z=${z}, r='${r}'.`);
    req.pipe(
        request(url)
            .on('error', err => {
                const message = 'Cannot fetch map tiles.';
                logger.error(message, err);
                res.status(500).send({ message });
            })
            .on('response', proxiedResponse => {
                // NOTE: Stadia enforces HSTS, but SSL is not required when using Cloudify Manager
                delete proxiedResponse.headers['strict-transport-security'];
            })
    ).pipe(res);
});

export default router;
