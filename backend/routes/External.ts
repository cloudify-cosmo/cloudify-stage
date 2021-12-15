import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'request';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('External');

function pipeRequest(req: Request, res: Response, next: NextFunction, url: string, queryString: string) {
    logger.debug(`Piping get request to url: ${url} with query string: ${queryString}`);

    req.pipe(
        request.get({ url: url.startsWith('//') ? `http:${url}` : url, qs: queryString }).on('error', err => {
            res.status(500).send({ message: err.message });
        })
    ).pipe(res);
}

interface GetContentQuery {
    url: string;
    queryString: string;
}
router.get('/content', (req: Request<any, any, any, any, GetContentQuery>, res, next) => {
    const { url, ...queryString } = req.query;
    pipeRequest(req, res, next, url, queryString);
});

export default router;
