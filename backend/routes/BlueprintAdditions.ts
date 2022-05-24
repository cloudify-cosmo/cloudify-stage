import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import _ from 'lodash';
import type { AxiosRequestHeaders } from 'axios';
import { db } from '../db/Connection';
import type { BlueprintAdditionsInstance } from '../db/models/BlueprintAdditionsModel';
import { getHeadersWithAuthenticationTokenFromRequest } from '../utils';
import * as ManagerHandler from '../handler/ManagerHandler';
import { requestAndForwardResponse } from '../handler/RequestHandler';
import { getLogger } from '../handler/LoggerHandler';

const router = express.Router();
const logger = getLogger('BlueprintAdditions');

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
