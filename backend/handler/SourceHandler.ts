import fs from 'fs-extra';
import _ from 'lodash';
import os from 'os';
import pathlib from 'path';
import url from 'url';
import mime from 'mime-types';
import { isBinaryFileSync } from 'isbinaryfile';
import type { Request } from 'express';

// eslint-disable-next-line import/no-unresolved,node/no-missing-import
import type { ParamsDictionary } from 'express-serve-static-core';
import { getConfig } from '../config';
import { isYamlFile } from '../sharedUtils';
import * as ArchiveHelper from './ArchiveHelper';

import { getLogger } from './LoggerHandler';
import type { ScanningItem } from './SourceHandler.types';

const logger = getLogger('SourceHandler');

const sourceConfig = getConfig().app.source;
const browseSourcesDir = pathlib.join(os.tmpdir(), sourceConfig.browseSourcesDir);
const lookupYamlsDir = pathlib.join(os.tmpdir(), sourceConfig.lookupYamlsDir);

const blueprintExtractDir = 'extracted';

type RequestWithQuery<Query> = Request<ParamsDictionary, any, any, Query, Record<string, any>>;

function isUnixHiddenPath(path: string) {
    // eslint-disable-next-line no-useless-escape
    return /(^|.\/)\.+[^\/\.]/g.test(path);
}

function toRelativeUrl(relativePath: string) {
    const absoluteUrl = url.pathToFileURL(relativePath);
    const relativeUrl = absoluteUrl.pathname.substring(url.pathToFileURL('').pathname.length + 1);
    return relativeUrl;
}

function scanRecursive(rootDir: string, scannedFileOrDirPath: string) {
    const stats = fs.statSync(scannedFileOrDirPath);
    const name = pathlib.basename(scannedFileOrDirPath);

    if (stats.isSymbolicLink() || isUnixHiddenPath(name)) {
        return null;
    }

    const item: ScanningItem = {
        key: toRelativeUrl(pathlib.relative(rootDir, scannedFileOrDirPath)),
        title: name,
        isDir: false,
        children: []
    };

    if (stats.isFile()) {
        return item;
    }
    if (stats.isDirectory()) {
        const scannedDir = scannedFileOrDirPath;
        try {
            const children = fs
                .readdirSync(scannedDir)
                .map(child => scanRecursive(rootDir, pathlib.join(scannedDir, child)))
                .filter(e => !!e) as ScanningItem[];

            item.isDir = true;
            item.children = _.sortBy(children, i => !i.isDir);

            return item;
        } catch (error: any) {
            if (error.code === 'EACCES') {
                logger.debug('cannot access directory, ignoring');
            }
            return null;
        }
    } else {
        return null;
    }
}

function scanArchive(archivePath: string) {
    logger.debug('scaning archive', archivePath);
    return scanRecursive(archivePath, archivePath);
}

export function browseArchiveTree(req: Request, timestamp = Date.now().toString()) {
    const { blueprintId } = req.params;
    const archiveUrl = `/blueprints/${blueprintId}/archive`;
    logger.debug('download archive from url', archiveUrl);

    const archiveFolder = pathlib.join(browseSourcesDir, `${blueprintId}${timestamp}`);
    return ArchiveHelper.removeOldExtracts(browseSourcesDir)
        .then(() => ArchiveHelper.saveDataFromUrl(archiveUrl, archiveFolder, req))
        .then(data => {
            const archivePath = pathlib.join(data.archiveFolder, data.archiveFile);
            const extractedDir = pathlib.join(data.archiveFolder, blueprintExtractDir);

            return ArchiveHelper.decompressArchive(archivePath, extractedDir).then(() => ({
                ...scanArchive(extractedDir),
                timestamp
            }));
        });
}

function checkPrefix(absCandidate: string, absPrefix: string) {
    return absCandidate.substring(0, absPrefix.length) === absPrefix;
}

export async function getArchiveFile(req: Request, timestamp: string, path: string) {
    const { blueprintId } = req.params;
    const absolutePath = pathlib.resolve(browseSourcesDir, `${blueprintId}${timestamp}`, blueprintExtractDir, path);

    if (!checkPrefix(absolutePath, browseSourcesDir)) {
        throw new Error('Wrong path');
    }

    if (!fs.existsSync(absolutePath)) {
        // Cluster node may have changed, so fetch and extract blueprint archive if requested file does not exist
        await browseArchiveTree(req, timestamp);
    }

    const data = await fs.readFile(absolutePath, 'utf-8');
    const buf = Buffer.from(data, 'utf8');
    const isBinaryFile = isBinaryFileSync(buf, buf.length);
    const file = await fs.readFile(absolutePath, isBinaryFile ? '' : 'utf-8');
    return { file, isBinaryFile };
}

export async function getArchiveFileContent(req: Request, timestamp: string, path: string) {
    return getArchiveFile(req, timestamp, path).then(({ file }) => file);
}

export function getMimeType(req: Request, timestamp: string, path: string) {
    const { blueprintId } = req.params;
    const absolutePath = pathlib.resolve(browseSourcesDir, `${blueprintId}${timestamp}`, blueprintExtractDir, path);
    return mime.lookup(absolutePath);
}

function saveMultipartData(req: Request) {
    const targetPath = pathlib.join(lookupYamlsDir, `archive${Date.now()}`);
    return ArchiveHelper.saveMultipartData(req, targetPath, 'archive');
}

function saveDataFromUrl(archiveUrl: string) {
    const targetPath = pathlib.join(lookupYamlsDir, `archive${Date.now()}`);
    return ArchiveHelper.saveDataFromUrl(archiveUrl, targetPath);
}

interface ArchiveContent {
    archiveFileName: string;
    extractedDir: string;
    decompressData: any;
}

function getBlueprintArchiveContent(request: RequestWithQuery<any>) {
    const { query } = request;
    const promise = query.url ? saveDataFromUrl(query.url) : saveMultipartData(request);

    return promise.then(data => {
        const { archiveFolder } = data;
        const { archiveFile } = data; // filename with extension
        const archiveFileName = pathlib.parse(archiveFile).name; // filename without extension
        const extractedDir = pathlib.join(archiveFolder, 'extracted');

        return ArchiveHelper.removeOldExtracts(lookupYamlsDir)
            .then(() => {
                if (_.isEmpty(archiveFile)) {
                    throw new Error('No archive file provided');
                } else {
                    const archivePath = pathlib.join(archiveFolder, archiveFile);

                    if (isYamlFile(archiveFile)) {
                        return ArchiveHelper.storeSingleYamlFile(archivePath, archiveFile, extractedDir);
                    }
                    return ArchiveHelper.decompressArchive(archivePath, extractedDir);
                }
            })
            .then(decompressData => ({
                archiveFileName,
                extractedDir,
                decompressData
            }))
            .catch(err => {
                ArchiveHelper.cleanTempData(archiveFolder).catch(logger.warn);
                throw err;
            });
    }) as Promise<ArchiveContent>;
}

function scanYamlFiles(extractedDir: string) {
    logger.debug('scaning yaml files from', extractedDir);

    let items = fs.readdirSync(extractedDir);

    if (items.length === 1 && fs.statSync(pathlib.join(extractedDir, items[0])).isDirectory()) {
        items = fs.readdirSync(pathlib.join(extractedDir, items[0]));
    }

    items = _.filter(items, item => item.toLowerCase().endsWith('.yaml') || item.toLowerCase().endsWith('.yml'));

    return Promise.resolve(items);
}

export function listYamlFiles(request: RequestWithQuery<{ includeFilename?: string; url?: string }>) {
    const { query } = request;
    const includeFilename = query.includeFilename === 'true';
    let archiveFileName = '';

    return getBlueprintArchiveContent(request)
        .then(data => {
            archiveFileName = data.archiveFileName;
            return scanYamlFiles(data.extractedDir);
        })
        .then(data => (includeFilename ? [archiveFileName, ...data] : data));
}
