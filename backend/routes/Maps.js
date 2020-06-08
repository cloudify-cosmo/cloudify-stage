const _ = require('lodash');
const express = require('express');
const passport = require('passport');
const request = require('request');

const config = require('../config').get();
const logger = require('../handler/LoggerHandler').getLogger('Maps');

const router = express.Router();
router.use(passport.authenticate('cookie', { session: false }));

router.get('/:z/:x/:y', (req, res) => {
    const { x, y, z } = req.params;
    const { key, tilesUrlTemplate } = config.app.maps;
    const url = _.template(tilesUrlTemplate)({ x, y, z, key });

    logger.debug(`Fetching map tiles from ${tilesUrlTemplate}, x=${x}, y=${y}, z=${z}.`);
    logger.debug(`Fetching map tiles from ${url}.`);
    req.pipe(request(url).on('error', err => res.status(500).send({ message: `${err}` }))).pipe(res);
});

module.exports = router;
