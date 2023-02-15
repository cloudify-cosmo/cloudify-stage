import express from 'express';
import _ from 'lodash';
import { renderBlueprint } from '../handler/EnvironmentHandler';
import type {
    ExternallCapability,
    PostEnvironmentBlueprintRequestBody,
    PostEnvironmentBlueprintResponse
} from './Environment.types';
import type { EnvironmentRenderParams } from '../handler/EnvironmentHandler.types';

const router = express.Router();
router.use(express.json());

router.post<never, PostEnvironmentBlueprintResponse, PostEnvironmentBlueprintRequestBody>(
    '/blueprint',
    (req, res, next) => {
        const environmentData = req.body;
        const environmentRenderParams: EnvironmentRenderParams = {
            description: environmentData.description,
            inputs: _(environmentData.capabilities.filter(capability => capability.source !== 'static'))
                .keyBy('name')
                .mapValues(capability =>
                    (<ExternallCapability>capability).blueprintDefault
                        ? {
                              defaultSource: capability.source === 'input' ? ('static' as const) : ('secret' as const),
                              defaultValue: capability.value
                          }
                        : null
                )
                .value(),
            labels: _(environmentData.labels.filter(label => label.blueprintDefault))
                .keyBy('key')
                .mapValues('value')
                .value(),
            capabilities: _(environmentData.capabilities)
                .keyBy('name')
                .mapValues(capability => ({
                    ...capability,
                    source: capability.source === 'secret' ? 'input' : capability.source
                }))
                .value()
        };

        try {
            const result = renderBlueprint(environmentRenderParams);
            res.setHeader('content-type', 'text/x-yaml');
            res.send(result);
        } catch (err: any) {
            next(err);
        }
    }
);

export default router;
