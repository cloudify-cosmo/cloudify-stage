import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { getLogger } from '../handler/LoggerHandler';
import { requestAndForwardResponse } from '../handler/RequestHandler';
import type { GetExternalContentQueryParams } from './External.types';
import type { GenericErrorResponse } from '../types';

const router = express.Router();
const logger = getLogger('External');

function pipeRequest(
    _req: Request<never, any | GenericErrorResponse, any, GetExternalContentQueryParams>,
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

router.get<never, any, any, GetExternalContentQueryParams>('/content', (req, res, next) => {
    const { url, ...queryString } = req.query;
    pipeRequest(req, res, next, url, queryString);
});

export default router;
