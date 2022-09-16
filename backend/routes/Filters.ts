import express from 'express';
import { getFilterUsage } from '../handler/FilterHandler';
import type { GetFiltersUsageResponse } from './Filters.types';

const router = express.Router();

router.get<{ filterId: string }, GetFiltersUsageResponse>('/usage/:filterId', (req, res, next) => {
    getFilterUsage(req.params.filterId)
        .then(result => res.send(result))
        .catch(next);
});

export default router;
