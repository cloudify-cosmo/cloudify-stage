import express from 'express';
import _ from 'lodash';
import type { AxiosRequestHeaders } from 'axios';
import { getHeadersWithAuthenticationTokenFromRequest } from '../utils';
import * as ManagerHandler from '../handler/ManagerHandler';
import { requestAndForwardResponse } from '../handler/RequestHandler';

const router = express.Router();

router.get('/image/:tenantName/:blueprintId', (req, res, next) => {
    const { blueprintId, tenantName } = req.params;
    const blueprintIconUrl = `${ManagerHandler.getManagerUrl()}/resources/blueprints/${tenantName}/${blueprintId}/icon.png`;
    const options = {
        headers: getHeadersWithAuthenticationTokenFromRequest(req, req.headers as AxiosRequestHeaders)
    };
    ManagerHandler.setManagerSpecificOptions(options, 'get');

    requestAndForwardResponse(blueprintIconUrl, res, options).catch(err => {
        if (err.response?.status === 304) {
            res.status(304).end();
        } else {
            next(err);
        }
    });
});

export default router;
