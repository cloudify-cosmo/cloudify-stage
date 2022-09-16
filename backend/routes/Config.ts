import express from 'express';
import { getMode } from '../serverSettings';
import { getClientConfig } from '../config';
import type { GetConfigResponse } from './Config.types';

const router = express.Router();

router.get<never, GetConfigResponse>('/', (_req, res) => {
    res.send(getClientConfig(getMode()));
});

export default router;
