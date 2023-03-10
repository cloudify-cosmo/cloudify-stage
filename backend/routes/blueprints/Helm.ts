import express from 'express';
import { renderHelmBlueprint } from '../../handler/HelmHandler';
import type { PostHelmBlueprintRequestBody, PostHelmBlueprintResponse } from './Helm.types';

const router = express.Router();
router.use(express.json());

router.post<never, PostHelmBlueprintResponse, PostHelmBlueprintRequestBody>('/blueprint', (req, res, next) => {
    try {
        const result = renderHelmBlueprint(req.body);
        res.setHeader('content-type', 'text/x-yaml');
        res.send(result);
    } catch (err: any) {
        next(err);
    }
});

export default router;
