import express from 'express';
import { getLogger } from '../handler/LoggerHandler';
import { getMode } from '../serverSettings';
import { getClientConfig } from '../config';

const router = express.Router();
const logger = getLogger('Config');

router.get('/', (req, res) => {
    res.send(getClientConfig(getMode()));
});

export default router;
