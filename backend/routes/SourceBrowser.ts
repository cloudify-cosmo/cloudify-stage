import express from 'express';

import { browseArchiveFile, getMimeType, browseArchiveTree, listYamlFiles } from '../handler/SourceHandler';
import type {
    PutSourceListYamlQueryParams,
    PutSourceListYamlResponse,
    GetSourceBrowseBlueprintFileResponse,
    GetSourceBrowseBlueprintArchiveResponse
} from './SourceBrowser.types';

const router = express.Router();

router.get<never, GetSourceBrowseBlueprintFileResponse>('/browse/:blueprintId/file/:timestamp/*', (req, res, next) => {
    const path = req.params[0];
    const { timestamp } = req.params;

    if (!path) {
        next('no file path passed [path]');
    } else {
        const mimeType = getMimeType(req, timestamp, path) || 'text/plain';
        browseArchiveFile(req, timestamp, path)
            .then(content => res.contentType(mimeType).send(content))
            .catch(next);
    }
});

router.get<never, GetSourceBrowseBlueprintArchiveResponse>('/browse/:blueprintId/archive', (req, res, next) => {
    browseArchiveTree(req)
        .then(data => res.send(data))
        .catch(next);
});

router.put<never, PutSourceListYamlResponse, never, PutSourceListYamlQueryParams>('/list/yaml', (req, res, next) => {
    listYamlFiles(req)
        .then(data => res.send(data))
        .catch(next);
});

export default router;
