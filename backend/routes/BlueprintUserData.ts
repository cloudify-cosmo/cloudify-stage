// @ts-nocheck File not migrated fully to TS
import yaml from 'js-yaml';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import _ from 'lodash';

import { browseArchiveFile, browseArchiveTree } from '../handler/SourceHandler';
import { db } from '../db/Connection';

const router = express.Router();

router.use(bodyParser.json());

router.get('/layout/:blueprintId', (req, res) => {
    db.BlueprintUserData.findOne({ where: { ...req.params, ..._.pick(req.user, 'username') } }).then(blueprintData => {
        if (blueprintData) {
            res.send(blueprintData.layout);
        } else {
            browseArchiveTree(req).then(data => {
                const layoutFilePath = _.chain(data)
                    .get('children[0].children')
                    .find({ title: 'info.yaml' })
                    .get('key')
                    .value();
                if (layoutFilePath) {
                    browseArchiveFile(req, data.timestamp, layoutFilePath)
                        .then(yaml.safeLoad)
                        .then(layout => res.send(layout));
                } else {
                    res.status(404).send({});
                }
            });
        }
    });
});

router.put('/layout/:blueprint', (req, res) => {
    db.BlueprintUserData.findOrCreate({
        where: { blueprintId: req.params.blueprint, username: req.user.username },
        defaults: { layout: {} }
    }).then(([blueprintData]) => blueprintData.update({ layout: req.body }).then(() => res.sendStatus(200)));
});

export default router;
