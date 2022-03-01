import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'request';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('External');

interface GetContentQuery extends Record<string, string> {
    url: string;
}

function pipeRequest(
    req: Request<any, any, any, GetContentQuery>,
    res: Response,
    _next: NextFunction,
    url: string,
    queryString: any
) {
    logger.debug(`Piping get request to url: ${url} with query string: ${queryString}`);

    req.pipe(
        request.get({ url: url.startsWith('//') ? `http:${url}` : url, qs: queryString }).on('error', err => {
            res.status(500).send({ message: err.message });
        })
    ).pipe(res);
}

router.get<any, any, any, any, GetContentQuery>('/content', (req, res, next) => {
    const { url, ...queryString } = req.query;
    pipeRequest(req, res, next, url, queryString);
});

export default router;
