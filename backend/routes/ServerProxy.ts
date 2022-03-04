import express from 'express';
import type { Request, Response } from 'express';
import axios, { AxiosRequestConfig, AxiosRequestHeaders, AxiosResponseHeaders, Method } from 'axios';
import { isRbacInCache, getAndCacheConfig } from '../handler/AuthHandler';
import { getApiUrl, setManagerSpecificOptions } from '../handler/ManagerHandler';

import { getLogger } from '../handler/LoggerHandler';
import {
    forward,
    getResponseForwarder,
    requestAndForwardResponse,
    setUpRequestForwarding
} from '../handler/RequestHandler';

const router = express.Router();
setUpRequestForwarding(router);

const logger = getLogger('ServerProxy');

async function proxyRequest(req: Request, res: Response) {
    const serverUrl = req.originalUrl.substring(req.baseUrl.length);

    // if is a maintenance status fetch then update RBAC cache if empty
    if (serverUrl === `/maintenance` && req.method === 'GET' && !isRbacInCache()) {
        await getAndCacheConfig(req.headers['authentication-token'] as string);
    }

    const options: AxiosRequestConfig = { headers: req.headers as AxiosRequestHeaders, data: req.body };
    setManagerSpecificOptions(options, req.method);

    requestAndForwardResponse(getApiUrl() + serverUrl, res, {
        method: req.method as Method,
        responseType: 'stream',
        ...options
    }).catch(err => {
        if (err.response) {
            forward(err.response, res);
        } else {
            res.status(500).send({ message: `${serverUrl} ${err.message}` });
        }
    });
}

/**
 * End point to get a request from the manager. The matched path section is used as manager URL.
 */
router.all('/*', proxyRequest);

export default router;
