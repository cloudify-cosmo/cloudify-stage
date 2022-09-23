import express from 'express';
import type { Response } from 'express';
import { getMode } from '../serverSettings';
import { getClientConfig } from '../config';
import type { GetConfigResponse } from './Config.types';

const router = express.Router();

router.get('/', (_req, res: Response<GetConfigResponse>) => {
    res.send(getClientConfig(getMode()));
});

export default router;
