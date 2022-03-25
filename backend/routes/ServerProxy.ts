import express from 'express';
import type { Request, Response } from 'express';
import type { AxiosRequestConfig, AxiosRequestHeaders, Method } from 'axios';
import { isRbacInCache, getAndCacheConfig } from '../handler/AuthHandler';
import { getApiUrl, setManagerSpecificOptions } from '../handler/ManagerHandler';

import { forward, requestAndForwardResponse, setUpRequestForwarding } from '../handler/RequestHandler';
import { getAuthenticationTokenHeaderFromRequest, getTokenFromCookies } from '../utils';

const router = express.Router();
setUpRequestForwarding(router);

async function proxyRequest(req: Request, res: Response) {
    const serverUrl = req.originalUrl.substring(req.baseUrl.length);
    const token = getTokenFromCookies(req);
    const headers = { ...(req.headers as AxiosRequestHeaders), ...getAuthenticationTokenHeaderFromRequest(req) };

    // if is a maintenance status fetch then update RBAC cache if empty
    if (serverUrl === `/maintenance` && req.method === 'GET' && !isRbacInCache()) {
        await getAndCacheConfig(token);
    }

    const options: AxiosRequestConfig = {
        headers,
        method: req.method as Method,
        data: req.body
    };
    setManagerSpecificOptions(options, req.method);

    requestAndForwardResponse(getApiUrl() + serverUrl, res, options).catch(err => {
        if (err.response) {
            forward(err.response, res);
        } else {
            const message = `${err.code ?? ''} ${err.message ?? ''}`.trim() || 'Manager is not available';
            res.status(500).send({ message: `Requested URL: ${serverUrl} ${message}` });
        }
    });
}

/**
 * End point to get a request from the manager. The matched path section is used as manager URL.
 */
router.all('/*', proxyRequest);

export default router;
