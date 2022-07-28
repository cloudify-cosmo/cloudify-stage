import express from 'express';
import yaml from 'js-yaml';
import _ from 'lodash';
import { db } from '../db/Connection';
import type { BlueprintUserDataInstance } from '../db/models/BlueprintUserDataModel';

import { browseArchiveFile, browseArchiveTree } from '../handler/SourceHandler';

const router = express.Router();

router.use(express.json());

router.get('/layout/:blueprintId', (req, res, next) => {
    db.BlueprintUserData.findOne<BlueprintUserDataInstance>({
        where: { ...req.params, ..._.pick(req.user, 'username') }
    })
        .then(blueprintData => {
            if (blueprintData) {
                return res.send(blueprintData.layout);
            }
            return browseArchiveTree(req).then(data => {
                const layoutFilePath = _.chain(data)
                    .get('children[0].children')
                    // @ts-ignore FIXME: Property 'find' does not exist on type 'LoDashExplicitWrapper<any>'
                    .find({ title: 'info.yaml' })
                    .get('key')
                    .value();
                if (layoutFilePath) {
                    return browseArchiveFile(req, data.timestamp, layoutFilePath)
                        .then(yaml.load)
                        .then(layout => res.send(layout));
                }

                return res.status(404).send({});
            });
        })
        .catch(next);
});

router.put('/layout/:blueprint', (req, res, next) => {
    db.BlueprintUserData.findOrCreate<BlueprintUserDataInstance>({
        where: { blueprintId: req.params.blueprint, username: req.user!.username },
        defaults: { blueprintId: req.params.blueprint, username: req.user!.username, layout: {} }
    })
        .then(([blueprintData]) => blueprintData.update({ layout: req.body }).then(() => res.sendStatus(200)))
        .catch(next);
});

export default router;
