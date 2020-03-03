/**
 * Created by jakub.niezgoda on 25/06/2018.
 */
const express = require('express');
const request = require('request');

const router = express.Router();
const logger = require('../handler/LoggerHandler').getLogger('External');

function _pipeRequest(req, res, next, url, queryString) {
    logger.debug(`Piping get request to url: ${url} with query string: ${queryString}`);

    req.pipe(
        request.get({ url: url.startsWith('//') ? `https:${url}` : url, qs: queryString }).on('error', function(err) {
            res.status(500).send({ message: err.message });
        })
    ).pipe(res);
}

router.get('/content', function(req, res, next) {
    const { url, ...queryString } = req.query;
    _pipeRequest(req, res, next, url, queryString);
});

module.exports = router;
