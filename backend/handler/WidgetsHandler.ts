// @ts-nocheck File not migrated fully to TS

import os from 'os';
import fs from 'fs-extra';
import pathlib from 'path';
import mkdirp from 'mkdirp';
import _ from 'lodash';
import { db } from '../db/Connection';

import { getLogger } from './LoggerHandler';

import { getConfig } from '../config';
import { getResourcePath } from '../utils';
import * as ArchiveHelper from './ArchiveHelper';
import * as BackendHandler from './BackendHandler';

const logger = getLogger('WidgetHandler');

const builtInWidgetsFolder = getResourcePath('widgets', false);
const userWidgetsFolder = getResourcePath('widgets', true);
const widgetTempDir = pathlib.join(os.tmpdir(), getConfig().app.widgets.tempDir);

function saveMultipartData(req) {
    const targetPath = pathlib.join(widgetTempDir, `widget${Date.now()}`);
    return ArchiveHelper.saveMultipartData(req, targetPath, 'widget');
}

function saveDataFromUrl(archiveUrl) {
    const targetPath = pathlib.join(widgetTempDir, `widget${Date.now()}`);
    return ArchiveHelper.saveDataFromUrl(archiveUrl, targetPath);
}

// Credits to: https://geedew.com/remove-a-directory-that-is-not-empty-in-nodejs/

function rmdirSync(path) {
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

function getUserWidgets() {
    return fs
        .readdirSync(pathlib.resolve(userWidgetsFolder))
        .filter(dir => fs.lstatSync(pathlib.resolve(userWidgetsFolder, dir)).isDirectory());
}

function getBuiltInWidgets() {
    return fs
        .readdirSync(pathlib.resolve(builtInWidgetsFolder))
        .filter(
            dir =>
                fs.lstatSync(pathlib.resolve(builtInWidgetsFolder, dir)).isDirectory() &&
                _.indexOf(getConfig().app.widgets.ignoreFolders, dir) < 0
        );
}

function getAllWidgets() {
    return _.concat(getBuiltInWidgets(), getUserWidgets());
}

function validateUniqueness(widgetId) {
    logger.debug(`Validating widget ${widgetId} uniqueness.`);

    const widgets = getAllWidgets();
    if (_.indexOf(widgets, widgetId) >= 0) {
        return Promise.reject({ status: 422, message: `Widget ${widgetId} is already installed` });
    }

    return Promise.resolve();
}

function validateConsistency(widgetId, dirName) {
    logger.debug(`Validating widget ${widgetId} consistency.`);

    if (widgetId !== dirName) {
        return Promise.reject({
            status: 400,
            message: `Updated widget directory name invalid. Expected: '${widgetId}'. Received: '${dirName}'`
        });
    }

    return Promise.resolve();
}

function validateWidget(widgetId, extractedDir) {
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

function installFiles(widgetId, tempPath) {
    logger.debug('Installing widget files to the target path:', pathlib.resolve(userWidgetsFolder));
    logger.debug('Widget temp path:', tempPath);

    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);

    return new Promise((resolve, reject) => {
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

function backupWidget(widgetId, tempPath) {
    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);
    const backupPath = pathlib.resolve(tempPath, 'backup');

    logger.debug(`Creating backup of widget ${widgetId} in ${backupPath}`);
    return new Promise((resolve, reject) => {
        fs.copy(installPath, backupPath, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function restoreBackup(widgetId, tempPath) {
    const installPath = pathlib.resolve(userWidgetsFolder, widgetId);
    const backupPath = pathlib.resolve(tempPath, 'backup');

    logger.debug(`Restoring backup of widget ${widgetId} from ${backupPath}`);
    return new Promise((resolve, reject) => {
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

export function deleteWidget(widgetId) {
    const path = pathlib.resolve(userWidgetsFolder, widgetId);

    logger.debug(`Deleting widget ${widgetId} from ${path}`);
    return new Promise((resolve, reject) => {
        fs.remove(path, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    }).then(() => BackendHandler.removeWidgetBackend(widgetId));
}

export function installWidget(archiveUrl, username, req) {
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

                    ArchiveHelper.cleanTempData(widgetTempPath);

                    return Promise.resolve({ id: widgetId, isCustom: true });
                })
                .catch(err => {
                    logger.error(`Error during widget ${widgetId} installation: ${err}`);
                    deleteWidget(widgetId);
                    ArchiveHelper.cleanTempData(widgetTempPath);
                    throw err;
                });
        });
}

export function updateWidget(updateWidgetId, archiveUrl, req) {
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

                    ArchiveHelper.cleanTempData(widgetTempPath);

                    return Promise.resolve({ id: widgetId, isCustom: true });
                })
                .catch(err => {
                    logger.error(`Error during widget ${widgetId} update: ${err}`);
                    restoreBackup(updateWidgetId, widgetTempPath)
                        .then(() => BackendHandler.removeWidgetBackend(widgetId))
                        .then(() => BackendHandler.importWidgetBackend(widgetId))
                        .then(() => ArchiveHelper.cleanTempData(widgetTempPath));
                    throw err;
                });
        });
}
export function listWidgets() {
    const builtInWidgets = _.map(getBuiltInWidgets(), widget => ({ id: widget, isCustom: false }));
    const userWidgets = _.map(getUserWidgets(), widget => ({ id: widget, isCustom: true }));

    return Promise.resolve(_.concat(builtInWidgets, userWidgets));
}

export function isWidgetUsed(widgetId) {
    return db.UserApp.findAll({ attributes: ['appData', 'username'] }).then(userApp => {
        const result = [];
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
