/**
 * Created by kinneretzin on 08/03/2017.
 */

const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const db = require('../db/Connection');
const config = require('../config').get();

const logger = require('../handler/LoggerHandler').getLogger('ClientConfig');

router.use(passport.authenticate('token', { session: false }));
router.use(bodyParser.json());

/**
 * End point to get a request from the server. Assuming it has a url parameter 'su' - server url
 */
router.get('/', (req, res, next) => {
    db.ClientConfig.findOrCreate({
        where: { managerIp: config.manager.ip },
        defaults: { config: { canUserEdit: true } }
    })
        .then(clientConfig => {
            res.send(clientConfig[0]);
        })
        .catch(next);
});

router.post('/', (req, res, next) => {
    db.ClientConfig.findOrCreate({
        where: { managerIp: config.manager.ip },
        defaults: { config: { canUserEdit: true } }
    })
        .spread((clientConfig, created) => {
            clientConfig.update({ config: req.body }, { fields: ['config'] }).then(c => {
                res.send(c);
            });
        })
        .catch(next);
});

module.exports = router;
