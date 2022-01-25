import express from 'express';
import { getFilterUsage } from '../handler/FilterHandler';

const router = express.Router();

router.get('/usage/:filterId', (req, res, next) => {
    getFilterUsage(req.params.filterId)
        .then(result => res.send(result))
        .catch(next);
});

export default router;
