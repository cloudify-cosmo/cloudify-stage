import express from 'express';
import type { Response } from 'express';

import { getArchiveFile, getMimeType, browseArchiveTree, listYamlFiles } from '../handler/SourceHandler';
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
        const mimeType = getMimeType(req, timestamp, path);

        getArchiveFile(req, timestamp, path)
            .then(({ file, isBinaryFile }) => {
                if (mimeType) {
                    return res.contentType(mimeType).send(file);
                }
                if (isBinaryFile) {
                    return res.contentType('application/octet-stream').send(file);
                }
                return res.contentType('text/plain').send(file);
            })
            .catch(next);
    }
});

router.get(
    '/browse/:blueprintId/archive',
    (req, res: Response<GetSourceBrowseBlueprintArchiveResponse | null>, next) => {
        browseArchiveTree(req)
            .then(data => res.send(data))
            .catch(next);
    }
);

router.put<never, PutSourceListYamlResponse, never, PutSourceListYamlQueryParams>('/list/yaml', (req, res, next) => {
    listYamlFiles(req)
        .then(data => res.send(data))
        .catch(next);
});

export default router;
