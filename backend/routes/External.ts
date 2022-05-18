import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { getLogger } from '../handler/LoggerHandler';
import { requestAndForwardResponse } from '../handler/RequestHandler';

const router = express.Router();
const logger = getLogger('External');

interface GetContentQuery extends Record<string, string> {
    url: string;
}

function pipeRequest(
    _req: Request<any, any, any, GetContentQuery>,
    res: Response,
    _next: NextFunction,
    url: string,
    queryString: any
) {
    logger.debug('Piping get request to url:', url, 'with query string:', queryString);

    requestAndForwardResponse(url.startsWith('//') ? `http:${url}` : url, res, { params: queryString }).catch(err =>
        res.status(500).send({ message: err.message })
    );
}

router.get<any, any, any, any, GetContentQuery>('/content', (req, res, next) => {
    const { url, ...queryString } = req.query;
    pipeRequest(req, res, next, url, queryString);
});

export default router;
