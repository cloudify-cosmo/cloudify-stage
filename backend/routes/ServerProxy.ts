import type { AxiosRequestConfig, Method } from 'axios';
import bytes from 'bytes';
import type { Request, Response } from 'express';
import express from 'express';
import { getConfig } from '../config';
import { getAndCacheConfig, isRbacInCache } from '../handler/AuthHandler';
import { getApiUrl, setManagerSpecificOptions } from '../handler/ManagerHandler';
import { forward, requestAndForwardResponse } from '../handler/RequestHandler';
import { getHeadersWithAuthenticationTokenFromRequest, getTokenFromCookies } from '../utils';

const { maxBodySize } = getConfig().app.proxy;

const router = express.Router();

router.use(express.raw({ inflate: false, type: () => true, limit: maxBodySize }));

async function proxyRequest(req: Request, res: Response) {
    const serverUrl = req.originalUrl.substring(req.baseUrl.length);
    const token = getTokenFromCookies(req);
    let { headers } = req;
    if (token) {
        headers = getHeadersWithAuthenticationTokenFromRequest(req, headers);
    }

    // if is a maintenance status fetch then update RBAC cache if empty
    if (serverUrl === `/maintenance` && req.method === 'GET' && !isRbacInCache()) {
        await getAndCacheConfig(token);
    }

    const options: AxiosRequestConfig = {
        headers,
        method: req.method as Method,
        data: req.body,
        maxBodyLength: bytes(maxBodySize)
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
