import express from 'express';
import bodyParser from 'body-parser';
import { db } from '../db/Connection';

import { getConfig } from '../config';
import type { ClientConfigsInstance } from '../db/models/ClientConfigsModel';

const router = express.Router();

router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', (_req, res, next) => {
    db.ClientConfigs.findOrCreate<ClientConfigsInstance>({
        where: { managerIp: getConfig().manager.ip },
        defaults: { managerIp: getConfig().manager.ip, config: { canUserEdit: true } }
    })
        .then(([clientConfig]) => {
            res.send(clientConfig);
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.ClientConfigs.findOrCreate<ClientConfigsInstance>({
        where: { managerIp: getConfig().manager.ip },
        defaults: { managerIp: getConfig().manager.ip, config: { canUserEdit: true } }
    })
        .then(([clientConfig]) => {
            clientConfig.update({ config: req.body }, { fields: ['config'] }).then(c => {
                res.send(c);
            });
        })
        .catch(next);
});

export default router;
