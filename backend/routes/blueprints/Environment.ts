import express from 'express';
import { renderEnvironmentBlueprint } from '../../handler/EnvironmentHandler';
import type { PostEnvironmentBlueprintRequestBody, PostEnvironmentBlueprintResponse } from './Environment.types';

const router = express.Router();
router.use(express.json());

router.post<never, PostEnvironmentBlueprintResponse, PostEnvironmentBlueprintRequestBody>(
    '/blueprint',
    (req, res, next) => {
        try {
            const result = renderEnvironmentBlueprint(req.body);
            res.setHeader('content-type', 'text/x-yaml');
            res.send(result);
        } catch (err: any) {
            next(err);
        }
    }
);

export default router;
