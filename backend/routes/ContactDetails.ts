// @ts-nocheck File not migrated fully to TS
import express from 'express';
import { getLogger } from '../handler/LoggerHandler';

import { getMode } from '../serverSettings';

const logger = getLogger('Maps');
const router = express.Router();

// function validateEdition(req: Request, res: Response, next: NextFunction) {
//     if (getMode() !== MODE_COMMUNITY) {
//         logger.error(`Endpoint ${req.baseUrl} only available in community edition.`);
//         res.sendStatus(403);
//     }
//     next();
// }

// router.use(validateEdition);
router.get('/', (req, res) => {
    res.send({
        details_submitted: true
    });
});

router.get('/submitted', (req, res) => {
    res.send({
        details_submitted: true
    });
});

export default router;
