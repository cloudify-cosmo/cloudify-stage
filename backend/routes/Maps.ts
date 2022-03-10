import _ from 'lodash';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';

import axios from 'axios';
import { getConfig } from '../config';
import { getLogger } from '../handler/LoggerHandler';
import { getMode, MODE_COMMUNITY } from '../serverSettings';

const logger = getLogger('Maps');
const router = express.Router();

function validateEdition(req: Request, res: Response, next: NextFunction) {
    if (getMode() === MODE_COMMUNITY) {
        logger.error(`Endpoint ${req.baseUrl} not available in community edition.`);
        res.sendStatus(403);
    }
    next();
}

router.use(validateEdition);

router.get('/:z/:x/:y/:r?', (req, res) => {
    const { x, y, z, r = '' } = req.params;
    const { accessToken, tilesUrlTemplate } = getConfig().app.maps;
    const url = _.template(tilesUrlTemplate)({ x, y, z, r, accessToken });

    logger.debug(`Fetching map tiles from ${tilesUrlTemplate}, x=${x}, y=${y}, z=${z}, r='${r}'.`);

    axios(url, { responseType: 'stream' })
        .then(axiosResponse => {
            delete axiosResponse.headers['strict-transport-security'];
            res.status(axiosResponse.status).set(axiosResponse.headers);
            axiosResponse.data.pipe(res);
        })
        .catch(err => {
            const message = 'Cannot fetch map tiles.';
            logger.error(message, err);
            res.status(500).send({ message });
        });
});

export default router;
