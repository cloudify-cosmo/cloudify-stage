import express from 'express';
import type { Response } from 'express';
import yaml from 'js-yaml';
import _ from 'lodash';
import { db } from '../db/Connection';
import type { BlueprintUserDataInstance } from '../db/models/BlueprintUserDataModel';

import { getArchiveFileContent, browseArchiveTree } from '../handler/SourceHandler';
import type {
    PutBlueprintUserDataLayoutRequestBody,
    GetBlueprintUserDataLayoutResponse
} from './BlueprintUserData.types';

const router = express.Router();

router.use(express.json());

router.get('/layout/:blueprintId', (req, res: Response<GetBlueprintUserDataLayoutResponse>, next) => {
    db.BlueprintUserData.findOne<BlueprintUserDataInstance>({
        where: { ...req.params, ..._.pick(req.user, 'username') }
    })
        .then(blueprintData => {
            if (blueprintData) {
                return res.send(blueprintData.layout);
            }
            return browseArchiveTree(req).then(data => {
                if (data !== null) {
                    const layoutFilePath = _.chain(data)
                        .get('children[0].children')
                        // @ts-ignore FIXME: Property 'find' does not exist on type 'LoDashExplicitWrapper<any>'
                        .find({ title: 'info.yaml' })
                        .get('key')
                        .value();
                    if (layoutFilePath) {
                        return getArchiveFileContent(req, data.timestamp, layoutFilePath)
                            .then(yaml.load)
                            .then(layout => res.send(layout));
                    }
                }
                return res.status(404).send({});
            });
        })
        .catch(next);
});

router.put<{ blueprint: string }, never, PutBlueprintUserDataLayoutRequestBody>(
    '/layout/:blueprint',
    (req, res, next) => {
        db.BlueprintUserData.findOrCreate<BlueprintUserDataInstance>({
            where: { blueprintId: req.params.blueprint, username: req.user!.username },
            defaults: { blueprintId: req.params.blueprint, username: req.user!.username, layout: {} }
        })
            .then(([blueprintData]) => blueprintData.update({ layout: req.body }).then(() => res.sendStatus(200)))
            .catch(next);
    }
);

export default router;
