import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import { format } from 'url';
import { getLogger } from '../handler/LoggerHandler';
import { requestAndForwardResponse } from '../handler/RequestHandler';
import type { GetExternalContentQueryParams } from './External.types';
import type { GenericErrorResponse } from '../types';

const router = express.Router();
const logger = getLogger('External');

function pipeRequest(
    req: Request<never, any | GenericErrorResponse, any, GetExternalContentQueryParams>,
    res: Response,
    _next: NextFunction,
    url: string,
    queryString: any
) {
    logger.debug('Piping get request to url:', url, 'with query string:', queryString);

    let requestUrl;
    if (url.startsWith('//')) {
        requestUrl = `http:${url}`;
    } else if (url.startsWith('/')) {
        requestUrl = format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: url
        });
    } else {
        requestUrl = url;
    }

    requestAndForwardResponse(requestUrl, res, { params: queryString }).catch(err =>
        res.status(500).send({ message: err.message })
    );
}

router.get<never, any, any, GetExternalContentQueryParams>('/content', (req, res, next) => {
    const { url, ...queryString } = req.query;
    pipeRequest(req, res, next, url, queryString);
});

export default router;
