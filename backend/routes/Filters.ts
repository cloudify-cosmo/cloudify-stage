import express from 'express';
import type { Response } from 'express';
import { getFilterUsage } from '../handler/FilterHandler';
import type { GetFiltersUsageResponse } from './Filters.types';

const router = express.Router();

router.get('/usage/:filterId', (req, res: Response<GetFiltersUsageResponse>, next) => {
    getFilterUsage(req.params.filterId)
        .then(result => res.send(result))
        .catch(next);
});

export default router;
