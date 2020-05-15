/**
 * Created by jakub.niezgoda on 25/06/2018.
 */
const express = require('express');
const request = require('request');

const router = express.Router();
const logger = require('../handler/LoggerHandler').getLogger('External');

function pipeRequest(req, res, next, url, queryString) {
    logger.debug(`Piping get request to url: ${url} with query string: ${queryString}`);

    req.pipe(
        request.get({ url: url.startsWith('//') ? `http:${url}` : url, qs: queryString }).on('error', err => {
            res.status(500).send({ message: err.message });
        })
    ).pipe(res);
}

router.get('/content', (req, res, next) => {
    const { url, ...queryString } = req.query;
    pipeRequest(req, res, next, url, queryString);
});

module.exports = router;
