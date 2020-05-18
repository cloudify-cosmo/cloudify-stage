/**
 * Created by kinneretzin on 13/02/2017.
 */
const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('../db/Connection');

const ServerSettings = require('../serverSettings');
const config = require('../config').get();

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', (req, res, next) => {
    db.UserApp.findOne({
        where: {
            managerIp: config.manager.ip,
            username: req.user.username,
            mode: ServerSettings.settings.mode,
            tenant: req.headers.tenant
        }
    })
        .then(userApp => {
            res.send(userApp || {});
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.UserApp.findOrCreate({
        where: {
            managerIp: config.manager.ip,
            username: req.user.username,
            mode: ServerSettings.settings.mode,
            tenant: req.headers.tenant
        },
        defaults: { appData: {}, appDataVersion: req.body.version }
    })
        .spread((userApp, created) =>
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
    db.UserApp.findOne({
        where: {
            managerIp: config.manager.ip,
            username: req.user.username,
            mode: ServerSettings.settings.mode,
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

module.exports = router;
