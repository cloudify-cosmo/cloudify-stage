// @ts-nocheck File not migrated fully to TS
import express from 'express';
import request from 'request';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('External');

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

export default router;
