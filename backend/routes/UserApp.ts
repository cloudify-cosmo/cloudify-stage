// @ts-nocheck File not migrated fully to TS
import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import { db } from '../db/Connection';

import { getMode } from '../serverSettings';

const router = express.Router();

router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', (req, res, next) => {
    db.UserApps.findOne({
        where: {
            username: req.user.username,
            mode: getMode(),
            tenant: req.headers.tenant
        }
    })
        .then(userApp => {
            res.send(userApp || {});
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.UserApps.findOrCreate({
        where: {
            username: req.user.username,
            mode: getMode(),
            tenant: req.headers.tenant
        },
        defaults: { appData: {}, appDataVersion: req.body.version }
    })
        .then(([userApp]) =>
            userApp
                .update(
                    { appData: req.body.appData, appDataVersion: req.body.version },
                    { fields: ['appData', 'appDataVersion'] }
                )
                .then(ua => res.send(ua))
        )
        .catch(next);
});

router.get('/clear-pages', (req, res, next) => {
    db.UserApps.findOne({
        where: {
            username: req.user.username,
            mode: getMode(),
            tenant: req.query.tenant
        }
    })
        .then(userApp => {
            if (userApp) {
                return userApp.update({ appData: { pages: [] } });
            }
            return Promise.reject('Could not clear pages. Row not found');
        })
        .then(() => res.send({ status: 'ok' }))
        .catch(next);
});

export default router;
