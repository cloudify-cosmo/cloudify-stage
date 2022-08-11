// @ts-nocheck File not migrated fully to TS

import fs from 'fs-extra';
import yaml from 'js-yaml';
import _ from 'lodash';
import os from 'os';
import pathlib from 'path';
import url from 'url';
import mime from 'mime-types';

import { getConfig } from '../config';
import { isYamlFile } from '../sharedUtils';
import { getParams, getValuesWithPaths } from '../utils';
import * as ArchiveHelper from './ArchiveHelper';

import { getLogger } from './LoggerHandler';

const logger = getLogger('SourceHandler');

const sourceConfig = getConfig().app.source;
const browseSourcesDir = pathlib.join(os.tmpdir(), sourceConfig.browseSourcesDir);
const lookupYamlsDir = pathlib.join(os.tmpdir(), sourceConfig.lookupYamlsDir);

const blueprintExtractDir = 'extracted';

export type ScanningItem = { key: string; title: string; isDir: boolean; children?: ScanningItem[] };

function isUnixHiddenPath(path) {
    // eslint-disable-next-line no-useless-escape
    return /(^|.\/)\.+[^\/\.]/g.test(path);
}

function toRelativeUrl(relativePath) {
    const absoluteUrl = url.pathToFileURL(relativePath);
    const relativeUrl = absoluteUrl.pathname.substring(url.pathToFileURL('').pathname.length + 1);
    return relativeUrl;
}

function scanRecursive(rootDir, scannedFileOrDirPath) {
    const stats = fs.statSync(scannedFileOrDirPath);
    const name = pathlib.basename(scannedFileOrDirPath);

    if (stats.isSymbolicLink() || isUnixHiddenPath(name)) {
        return null;
    }

    const item: ScanningItem = {
        key: toRelativeUrl(pathlib.relative(rootDir, scannedFileOrDirPath)),
        title: name,
        isDir: false
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
                .filter(e => !!e);

            item.isDir = true;
            item.children = _.sortBy(children, i => !i.isDir);

            return item;
        } catch (ex) {
            if (ex.code === 'EACCES') {
                logger.debug('cannot access directory, ignoring');
            }
            return null;
        }
    } else {
        return null;
    }
}

function scanArchive(archivePath) {
    logger.debug('scaning archive', archivePath);
    return scanRecursive(archivePath, archivePath);
}

export function browseArchiveTree(req, timestamp = Date.now()) {
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

function checkPrefix(absCandidate, absPrefix) {
    return absCandidate.substring(0, absPrefix.length) === absPrefix;
}

export async function browseArchiveFile(req, timestamp, path) {
    const { blueprintId } = req.params;
    const absolutePath = pathlib.resolve(browseSourcesDir, `${blueprintId}${timestamp}`, blueprintExtractDir, path);

    if (!checkPrefix(absolutePath, browseSourcesDir)) {
        throw new Error('Wrong path');
    }

    if (!fs.existsSync(absolutePath)) {
        // Cluster node may have changed, so fetch and extract blueprint archive if requested file does not exist
        await browseArchiveTree(req, timestamp);
    }

    const mimeType = getMimeType(req, timestamp, path);
    if (!mimeType || mimeType.startsWith('text/')) {
        return fs.readFile(absolutePath, 'utf-8');
    }
    return fs.readFile(absolutePath, '');
}

export function getMimeType(req, timestamp, path) {
    const { blueprintId } = req.params;
    const absolutePath = pathlib.resolve(browseSourcesDir, `${blueprintId}${timestamp}`, blueprintExtractDir, path);
    return mime.lookup(absolutePath);
}

function saveMultipartData(req) {
    const targetPath = pathlib.join(lookupYamlsDir, `archive${Date.now()}`);
    return ArchiveHelper.saveMultipartData(req, targetPath, 'archive');
}

function saveDataFromUrl(archiveUrl) {
    const targetPath = pathlib.join(lookupYamlsDir, `archive${Date.now()}`);
    return ArchiveHelper.saveDataFromUrl(archiveUrl, targetPath);
}

function convertYamlToJson(path, yamlFile) {
    let yamlFilePath = '';

    let files = fs.readdirSync(path);
    if (_.includes(files, yamlFile)) {
        yamlFilePath = pathlib.resolve(path, yamlFile);
    } else if (files.length === 1 && fs.statSync(pathlib.join(path, files[0])).isDirectory()) {
        const directory = files[0];
        files = fs.readdirSync(pathlib.join(path, directory));
        if (_.includes(files, yamlFile)) {
            yamlFilePath = pathlib.resolve(path, directory, yamlFile);
        }
    }

    if (!_.isEmpty(yamlFilePath)) {
        try {
            const json = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));
            return Promise.resolve(json);
        } catch (error) {
            const errorMessage = `Cannot parse YAML file ${yamlFile}. Error: ${error}`;
            logger.error(errorMessage);
            return Promise.reject(errorMessage);
        }
    } else {
        return Promise.reject(`Cannot find YAML file ${yamlFile} in specified directory.`);
    }
}

function getInputs(inputs) {
    return _.mapValues(inputs, inputObject => inputObject || {});
}

function getPlugins(imports) {
    const PLUGIN_KEYWORD = 'plugin:';

    return _.chain(imports)
        .filter(imp => String(imp).match(PLUGIN_KEYWORD))
        .map(plugin => {
            const [packageName, pluginQueryString] = _.chain(plugin).replace(PLUGIN_KEYWORD, '').split('?').value();

            const params = getParams(pluginQueryString);
            const pluginObject = { packageName, params };

            return pluginObject;
        })
        .reduce((result, pluginObject) => {
            result[pluginObject.packageName] = _.omit(pluginObject, 'packageName');
            return result;
        }, {})
        .value();
}

function getSecrets(json) {
    const SECRET_KEYWORD = 'get_secret';

    return _.chain(getValuesWithPaths(json, SECRET_KEYWORD))
        .reduce((result, value) => {
            const secretName = _.keys(value)[0];
            const secretPath = value[secretName];

            if (_.isUndefined(result[secretName])) {
                result[secretName] = {};
            }

            (result[secretName].paths || (result[secretName].paths = [])).push(secretPath);

            return result;
        }, {})
        .value();
}

function getBlueprintArchiveContent(request) {
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
    });
}

export function getBlueprintResources(request) {
    const { query } = request;
    const { yamlFile } = query;

    return getBlueprintArchiveContent(request)
        .then(data => convertYamlToJson(data.extractedDir, yamlFile))
        .then(json => ({
            inputs: getInputs(json.inputs),
            dataTypes: json.data_types,
            plugins: getPlugins(json.imports),
            secrets: getSecrets(json)
        }));
}

function scanYamlFiles(extractedDir) {
    logger.debug('scaning yaml files from', extractedDir);

    let items = fs.readdirSync(extractedDir);

    if (items.length === 1 && fs.statSync(pathlib.join(extractedDir, items[0])).isDirectory()) {
        items = fs.readdirSync(pathlib.join(extractedDir, items[0]));
    }

    items = _.filter(items, item => item.toLowerCase().endsWith('.yaml') || item.toLowerCase().endsWith('.yml'));

    return Promise.resolve(items);
}

export function listYamlFiles(request) {
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
