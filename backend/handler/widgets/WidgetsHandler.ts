import type { Request } from 'express';
import fs from 'fs-extra';
import _ from 'lodash';
import mkdirp from 'mkdirp';
import os from 'os';
import pathlib from 'path';

import archiver from 'archiver';
import { getConfig } from '../../config';
import { db } from '../../db/Connection';
import type { UserAppsInstance } from '../../db/models/UserAppsModel';
import { getResourcePath } from '../../utils';
import * as ArchiveHelper from '../ArchiveHelper';
import * as BackendHandler from '../BackendHandler';

import { getLogger } from '../LoggerHandler';
import type { WidgetData, WidgetUsage } from '../WidgetsHandler.types';
import validateUniqueness from './validateUniqueness';

const logger = getLogger('WidgetHandler');

const builtInWidgetsFolder = getResourcePath('widgets', false);
const userWidgetsFolder = getResourcePath('widgets', true);
const widgetTempDir = pathlib.join(os.tmpdir(), getConfig().app.widgets.tempDir);

function saveMultipartData(req: Request, multipartId = 'widget') {
    const targetPath = pathlib.join(widgetTempDir, `widget${Date.now()}`);
    return ArchiveHelper.saveMultipartData(req, targetPath, multipartId);
}

function saveDataFromUrl(archiveUrl: string) {
    const targetPath = pathlib.join(widgetTempDir, `widget${Date.now()}`);
    return ArchiveHelper.saveDataFromUrl(archiveUrl, targetPath);
}

// Credits to: https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/

function rmdirSync(path: string) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(file => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
                // recurse
                rmdirSync(curPath);
            } else {
                // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}

export function getUserWidgets() {
    return fs
        .readdirSync(pathlib.resolve(userWidgetsFolder))
        .filter(dir => fs.lstatSync(pathlib.resolve(userWidgetsFolder, dir)).isDirectory());
}

export function getBuiltInWidgets() {
    return fs
        .readdirSync(pathlib.resolve(builtInWidgetsFolder))
        .filter(
            dir =>
                fs.lstatSync(pathlib.resolve(builtInWidgetsFolder, dir)).isDirectory() &&
                _.indexOf(getConfig().app.widgets.ignoreFolders, dir) < 0
        );
}

function validateConsistency(widgetId: string, dirName: string) {
    logger.debug(`Validating widget ${widgetId} consistency.`);

    if (widgetId !== dirName) {
        return Promise.reject({
            status: 400,
            message: `Updated widget directory name invalid. Expected: '${widgetId}'. Received: '${dirName}'`
        });
    }

    return Promise.resolve();
}

function validateWidget(widgetId: string, extractedDir: string) {
    logger.debug(`Validating widget ${widgetId}.`);

    let files = fs.readdirSync(extractedDir);
    let tempPath = extractedDir;

    // remove hidden or junk files
    files = _.filter(files, file => {
        return !file.match(/^\..+/) && file !== '__MACOSX';
    });

    if (files.length === 1 && fs.statSync(pathlib.join(extractedDir, files[0])).isDirectory()) {
        const dirName = files[0];
        if (dirName !== widgetId) {
            return Promise.reject({
                status: 400,
                message: `Incorrect widget folder name not consistent with widget id. Widget ID: '${widgetId}'. Directory name: '${dirName}'`
            });
        }

        tempPath = pathlib.join(extractedDir, dirName);
        files = fs.readdirSync(tempPath);
    }

    const { requiredFiles } = getConfig().app.widgets;
    const missingFiles = _.difference(requiredFiles, files);

    if (!_.isEmpty(missingFiles)) {
        return Promise.reject({
            status: 400,
            message: `The following files are required for widget registration: ${_.join(missingFiles, ', ')}`
        });
    }
    return Promise.resolve(tempPath);
}

function installFiles(widgetId: string, tempPath: string) {
    logger.debug('Installing widget files to the target path:', pathlib.resolve(userWidgetsFolder));
    logger.debug('Widget temp path:', tempPath);

    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);

    return new Promise<void>((resolve, reject) => {
        rmdirSync(installPath);
        fs.move(tempPath, installPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function backupWidget(widgetId: string, tempPath: string) {
    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);
    const backupPath = pathlib.resolve(tempPath, 'backup');

    logger.debug(`Creating backup of widget ${widgetId} in ${backupPath}`);
    return new Promise<void>((resolve, reject) => {
        fs.copy(installPath, backupPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function restoreBackup(widgetId: string, tempPath: string) {
    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);
    const backupPath = pathlib.resolve(tempPath, 'backup');

    logger.debug(`Restoring backup of widget ${widgetId} from ${backupPath}`);
    return new Promise<void>((resolve, reject) => {
        fs.removeSync(installPath);
        fs.move(backupPath, installPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

export function deleteWidget(widgetId: string) {
    const path = pathlib.resolve(userWidgetsFolder, widgetId);

    logger.debug(`Deleting widget ${widgetId} from ${path}`);
    return new Promise<void>((resolve, reject) => {
        fs.remove(path, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    }).then(() => BackendHandler.removeWidgetBackend(widgetId));
}

export function installWidget(archiveUrl: string | undefined, _username: string, req: Request): Promise<WidgetData> {
    logger.debug('Installing widget from', archiveUrl || 'file');

    return ArchiveHelper.removeOldExtracts(widgetTempDir)
        .then(() => (archiveUrl ? saveDataFromUrl(archiveUrl) : saveMultipartData(req)))
        .then(data => {
            const widgetTempPath = data.archiveFolder;
            const widgetZipFile = data.archiveFile;
            const widgetId = pathlib.parse(pathlib.parse(widgetZipFile).name).name;
            const archivePath = pathlib.join(widgetTempPath, widgetZipFile);
            const extractedDir = pathlib.join(widgetTempPath, widgetId);

            return validateUniqueness(widgetId)
                .then(() => ArchiveHelper.decompressArchive(archivePath, extractedDir))
                .then(() => validateWidget(widgetId, extractedDir))
                .then(tempPath => installFiles(widgetId, tempPath))
                .then(() => BackendHandler.importWidgetBackend(widgetId))
                .then(() => {
                    const widgetPath = pathlib.resolve(userWidgetsFolder, widgetId);

                    logger.info('New widget installed');
                    logger.info('Widget id: ', widgetId);
                    logger.info('Widget path: ', pathlib.resolve(widgetPath));

                    ArchiveHelper.cleanTempData(widgetTempPath).catch(logger.warn);

                    return Promise.resolve({ id: widgetId, isCustom: true });
                })
                .catch(err => {
                    logger.error(`Error during widget ${widgetId} installation: ${err}`);
                    deleteWidget(widgetId).catch(logger.error);
                    ArchiveHelper.cleanTempData(widgetTempPath).catch(logger.warn);
                    throw err;
                });
        });
}

export function updateWidget(
    updateWidgetId: string,
    archiveUrl: string | undefined,
    req: Request
): Promise<WidgetData> {
    logger.debug('Updating widget', updateWidgetId, 'from', archiveUrl || 'file');

    return ArchiveHelper.removeOldExtracts(widgetTempDir)
        .then(() => (archiveUrl ? saveDataFromUrl(archiveUrl) : saveMultipartData(req)))
        .then(data => {
            const widgetTempPath = data.archiveFolder;
            const widgetZipFile = data.archiveFile;
            const widgetId = pathlib.parse(pathlib.parse(widgetZipFile).name).name;
            const archivePath = pathlib.join(widgetTempPath, widgetZipFile);
            const extractedDir = pathlib.join(widgetTempPath, widgetId);

            return backupWidget(updateWidgetId, widgetTempPath)
                .then(() => validateConsistency(updateWidgetId, widgetId))
                .then(() => ArchiveHelper.decompressArchive(archivePath, extractedDir))
                .then(() => validateWidget(widgetId, extractedDir))
                .then(tempPath => installFiles(widgetId, tempPath))
                .then(() => BackendHandler.removeWidgetBackend(widgetId))
                .then(() => BackendHandler.importWidgetBackend(widgetId))
                .then(() => {
                    const widgetPath = pathlib.resolve(userWidgetsFolder, widgetId);

                    logger.info('Widget updated');
                    logger.info('Widget id:', widgetId);
                    logger.info('Widget path:', pathlib.resolve(widgetPath));

                    ArchiveHelper.cleanTempData(widgetTempPath).catch(logger.warn);

                    return Promise.resolve({ id: widgetId, isCustom: true });
                })
                .catch(err => {
                    logger.error(`Error during widget ${widgetId} update: ${err}`);
                    restoreBackup(updateWidgetId, widgetTempPath)
                        .then(() => BackendHandler.removeWidgetBackend(widgetId))
                        .then(() => BackendHandler.importWidgetBackend(widgetId))
                        .then(() => ArchiveHelper.cleanTempData(widgetTempPath))
                        .catch(logger.warn);
                    throw err;
                });
        });
}
export function listWidgets(): Promise<WidgetData[]> {
    const builtInWidgets = _.map(getBuiltInWidgets(), widget => ({ id: widget, isCustom: false }));
    const userWidgets = _.map(getUserWidgets(), widget => ({ id: widget, isCustom: true }));

    return Promise.resolve(_.concat(builtInWidgets, userWidgets));
}

export function isWidgetUsed(widgetId: string): Promise<WidgetUsage[]> {
    return db.UserApps.findAll<UserAppsInstance>({ attributes: ['appData', 'username'] }).then(userApp => {
        const result: WidgetUsage[] = [];
        _.forEach(userApp, row => {
            const filter = _.filter(row.appData.pages, { widgets: [{ definition: widgetId }] });
            if (!_.isEmpty(filter)) {
                // TODO(RD-1459) Refactor results to be just list of usernames
                result.push({ username: row.username, managerIp: '' });
            }
        });

        return result;
    });
}

export function init() {
    return new Promise((resolve, reject) => {
        try {
            logger.info('Setting up user widgets directory:', userWidgetsFolder);
            mkdirp.sync(userWidgetsFolder);
            return BackendHandler.initWidgetBackends().then(resolve).catch(reject);
        } catch (e) {
            logger.error('Could not set up directory, error was:', e);
            return reject(`Could not set up directory, error was: ${e}`);
        }
    });
}

export function createUserWidgetsSnapshot(onError: (err?: any) => void) {
    const archive = archiver('zip');
    archive.directory(userWidgetsFolder, false);
    archive.finalize().catch(onError);
    return archive;
}

export function restoreUserWidgetsSnapshot(req: Request) {
    return saveMultipartData(req, 'snapshot').then(({ archiveFolder, archiveFile }) => {
        const archivePath = pathlib.join(archiveFolder, archiveFile);
        const extractDirPath = pathlib.join(archiveFolder, 'extract');

        return ArchiveHelper.decompressArchive(archivePath, extractDirPath).then(() => {
            const widgetIds = fs.readdirSync(pathlib.resolve(extractDirPath));
            return Promise.all(widgetIds.map(widgetId => validateUniqueness(widgetId))).then(() =>
                Promise.all(
                    widgetIds.map(widgetId =>
                        installFiles(widgetId, pathlib.join(extractDirPath, widgetId)).then(() =>
                            BackendHandler.importWidgetBackend(widgetId)
                        )
                    )
                )
            );
        });
    });
}
