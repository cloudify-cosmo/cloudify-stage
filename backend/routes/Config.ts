import express from 'express';
import { getMode } from '../serverSettings';
import { getClientConfig } from '../config';

const router = express.Router();

router.get('/', (_req, res) => {
    res.send(getClientConfig(getMode()));
});

export default router;
