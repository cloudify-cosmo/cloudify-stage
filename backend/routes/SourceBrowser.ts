// @ts-nocheck File not migrated fully to TS

import express from 'express';
import passport from 'passport';
import { browseArchiveFile, browseArchiveTree, listYamlFiles, getBlueprintResources } from '../handler/SourceHandler';

const router = express.Router();

router.get('/browse/:blueprintId/file/:timestamp/*', (req, res, next) => {
    const { timestamp } = req.params;
    const path = req.params[0];

    if (!path) {
        next('no file path passed [path]');
    } else {
        browseArchiveFile(req, timestamp, path)
            .then(content => res.contentType('application/text').send(content))
            .catch(next);
    }
});

router.get('/browse/:blueprintId/archive', (req, res, next) => {
    browseArchiveTree(req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/yaml', (req, res, next) => {
    listYamlFiles(req)
        .then(data => res.send(data))
        .catch(next);
});

router.put('/list/resources', (req, res, next) => {
    getBlueprintResources(req)
        .then(data => res.send(data))
        .catch(next);
});

export default router;
