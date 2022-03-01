import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import request from 'request';
import type { CoreOptions } from 'request';
import { isRbacInCache, getAndCacheConfig } from '../handler/AuthHandler';
import { getApiUrl, updateOptions } from '../handler/ManagerHandler';

import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('ServerProxy');

interface RequestWithServerUrl extends Request {
    su?: string;
}

function errorHandler(url: string, res: Response, err: any) {
    const isTimeout = err.code === 'ETIMEDOUT';
    const isSocketTimeout = err.code === 'ESOCKETTIMEDOUT';
    const isConnTimeout = err.connect;

    const urlMsg = `Requested URL: ${url}.`;
    let exMsg;
    if (isConnTimeout) {
        exMsg = 'Manager is not available';
    } else if (isTimeout) {
        exMsg = 'Request timed out';
    } else if (isSocketTimeout) {
        // See https://community.particle.io/t/what-does-esockettimedout-mean/29100/7
        exMsg = 'Connected to the Manager but timed out when receiving data.';
    } else {
        exMsg = `An unexpected error has occurred: ${err.message}`;
    }

    logger.error(`${urlMsg} ${exMsg}`, err);
    if (!res.headersSent) {
        res.status(500).send({ message: `${urlMsg} ${exMsg}` });
    }
}

function buildManagerUrl(req: RequestWithServerUrl, _res: Response, next: NextFunction) {
    const serverUrl = req.originalUrl.substring(req.baseUrl.length);
    if (serverUrl) {
        req.su = getApiUrl() + serverUrl;
        logger.debug(`Proxying ${req.method} request to server with url: ${req.su}`);
        next();
    } else {
        next('no server url passed');
    }
}

async function proxyRequest(req: RequestWithServerUrl, res: Response) {
    const options: CoreOptions = {};

    // if is a maintenance status fetch then update RBAC cache if empty
    if (req.su === `${getApiUrl()}/maintenance` && req.method === 'GET' && !isRbacInCache()) {
        await getAndCacheConfig(req.headers['authentication-token'] as string);
    }

    updateOptions(options, req.method);

    req.pipe(
        request(req.su!, options).on('error', err => {
            errorHandler(req.su!, res, err);
        })
    ).pipe(res);
}

/**
 * End point to get a request from the manager. The matched path section is used as manager URL.
 */
router.all('/*', buildManagerUrl, proxyRequest);

export default router;
