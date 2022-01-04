// @ts-nocheck File not migrated fully to TS

import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { db } from '../db/Connection';

import { getConfig } from '../config';

const router = express.Router();

router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', (req, res, next) => {
    db.ClientConfigs.findOrCreate({
        where: { managerIp: getConfig().manager.ip },
        defaults: { config: { canUserEdit: true } }
    })
        .then(([clientConfig]) => {
            res.send(clientConfig);
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.ClientConfigs.findOrCreate({
        where: { managerIp: getConfig().manager.ip },
        defaults: { config: { canUserEdit: true } }
    })
        .then(([clientConfig]) => {
            clientConfig.update({ config: req.body }, { fields: ['config'] }).then(c => {
                res.send(c);
            });
        })
        .catch(next);
});

export default router;
