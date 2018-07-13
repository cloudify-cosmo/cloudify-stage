/**
 * Created by pposel on 24/02/2017.
 */

const os = require('os');
const db = require('../db/Connection');
const fs = require('fs-extra');
const pathlib = require('path');
const mkdirp = require('mkdirp');
const _ = require('lodash');

const logger = require('log4js').getLogger('WidgetHandler');

const config = require('../config').get();
const Utils = require('../utils');
const ArchiveHelper = require('./ArchiveHelper');
const ResourceTypes = require('../db/types/ResourceTypes');
const BackendHandler = require('./BackendHandler');

const builtInWidgetsFolder = Utils.getResourcePath('widgets', false);
const userWidgetsFolder = Utils.getResourcePath('widgets', true);
const widgetTempDir = pathlib.join(os.tmpdir(), config.app.widgets.tempDir);

module.exports = (function() {

    function _saveMultipartData(req) {
        const targetPath = pathlib.join(widgetTempDir, 'widget' + Date.now());
        return ArchiveHelper.saveMultipartData(req, targetPath, 'widget');
    }

    function _saveDataFromUrl(archiveUrl) {
        const targetPath = pathlib.join(widgetTempDir, 'widget' + Date.now());
        return ArchiveHelper.saveDataFromUrl(archiveUrl, targetPath);
    }

    function _getUserWidgets() {
        return fs.readdirSync(pathlib.resolve(userWidgetsFolder))
                .filter(dir => fs.lstatSync(pathlib.resolve(userWidgetsFolder, dir)).isDirectory());
    }

    function _getBuiltInWidgets() {
        return fs.readdirSync(pathlib.resolve(builtInWidgetsFolder))
                .filter(dir => fs.lstatSync(pathlib.resolve(builtInWidgetsFolder, dir)).isDirectory()
                        && _.indexOf(config.app.widgets.ignoreFolders, dir) < 0);
    }

    function _getAllWidgets() {
        return _.concat(_getBuiltInWidgets(), _getUserWidgets());
    }

    function _validateUniqueness(widgetId) {
        let widgets = _getAllWidgets();
        if (_.indexOf(widgets, widgetId) >= 0) {
            return Promise.reject({status: 422, message: 'Widget ' + widgetId + ' is already installed'});
        }

        return Promise.resolve();
    }

    function _validateConsistency(widgetId, dirName) {
        if (widgetId !== dirName) {
            return Promise.reject('Updated widget does not complies with directory name: ' + widgetId + ' <> ' + dirName);
        }

        return Promise.resolve();
    }

    function _validateWidget(widgetId, extractedDir) {
        let files = fs.readdirSync(extractedDir);

        //remove hidden or junk files
        files = _.filter(files, file => {
           return !file.match(/^\..+/) && file !== '__MACOSX';
        });

        if (files.length === 1 && fs.statSync(pathlib.join(extractedDir, files[0])).isDirectory()) {
            let dirName = files[0];
            if (dirName !== widgetId) {
                return Promise.reject('Incorrect widget folder name not consistent with widget id: ' + widgetId + ' <> ' + dirName);
            }

            extractedDir = pathlib.join(extractedDir, dirName);
            files = fs.readdirSync(extractedDir);
        }

        const requiredFiles = config.app.widgets.requiredFiles;
        const missingFiles = _.difference(requiredFiles, files);

        if (!_.isEmpty(missingFiles)) {
            return Promise.reject('The following files are required for widget registration: ' + _.join(missingFiles, ', '));
        } else {
            return Promise.resolve(extractedDir);
        }
    }

    function _installFiles(widgetId, tempPath) {
        logger.debug('installing widget files to the target path', pathlib.resolve(userWidgetsFolder));
        logger.debug('widget temp path', tempPath);

        const installPath = pathlib.resolve(userWidgetsFolder, widgetId);

        return new Promise((resolve, reject) => {
            fs.removeSync(installPath);
            fs.move(tempPath, installPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    function _persistData(widgetId, username) {
        return db.Resources
            .findOne({ where: {resourceId:widgetId, type:ResourceTypes.WIDGET} })
            .then(function(widget) {
                if(widget) {
                    return widget.update({creator: username});
                } else {
                    return db.Resources.create({resourceId:widgetId, type:ResourceTypes.WIDGET, creator: username});
                }
            });
    }

    function installWidget(archiveUrl, username, req) {
        return ArchiveHelper.removeOldExtracts(widgetTempDir)
            .then(() => archiveUrl ? _saveDataFromUrl(archiveUrl) : _saveMultipartData(req))
            .then(data => {
                const widgetTempPath = data.archiveFolder;
                const widgetZipFile = data.archiveFile;
                const widgetId = pathlib.parse(pathlib.parse(widgetZipFile).name).name;
                const archivePath = pathlib.join(widgetTempPath, widgetZipFile);
                const extractedDir = pathlib.join(widgetTempPath, widgetId);

                return ArchiveHelper.decompressArchive(archivePath, extractedDir)
                    .then(() => _validateUniqueness(widgetId))
                    .then(() => _validateWidget(widgetId, extractedDir))
                    .then((tempPath) => _installFiles(widgetId, tempPath))
                    .then(() => BackendHandler.importWidgetBackend(widgetId))
                    .then(() => _persistData(widgetId, username))
                    .then(() => {
                        var widgetPath = pathlib.resolve(userWidgetsFolder, widgetId);

                        logger.info('New widget installed');
                        logger.info('Widget id: ', widgetId);
                        logger.info('Widget path: ', pathlib.resolve(widgetPath));

                        ArchiveHelper.cleanTempData(widgetTempPath);

                        return Promise.resolve({id: widgetId, isCustom: true});
                    })
                    .catch(err => {
                        deleteWidget(widgetId);
                        ArchiveHelper.cleanTempData(widgetTempPath);
                        throw err;
                    });
            });
    }

    function updateWidget(updateWidgetId, archiveUrl, req) {
        return ArchiveHelper.removeOldExtracts(widgetTempDir)
            .then(() => ArchiveHelper.cleanTempData(pathlib.join(widgetTempDir, updateWidgetId)))
            .then(() => archiveUrl ? _saveDataFromUrl(archiveUrl) : _saveMultipartData(req))
            .then(data => {
                const widgetTempPath = data.archiveFolder;
                const widgetZipFile = data.archiveFile;
                const widgetId = pathlib.parse(pathlib.parse(widgetZipFile).name).name;
                const archivePath = pathlib.join(widgetTempPath, widgetZipFile);
                const extractedDir = pathlib.join(widgetTempPath, widgetId);

                return _backupWidget(widgetId, widgetTempPath)
                    .then(() =>_validateConsistency(updateWidgetId, widgetId))
                    .then(() => ArchiveHelper.decompressArchive(archivePath, extractedDir))
                    .then(() => _validateWidget(widgetId, extractedDir))
                    .then(tempPath => _installFiles(widgetId, tempPath))
                    .then(() => BackendHandler.removeWidgetBackend(widgetId))
                    .then(() => BackendHandler.importWidgetBackend(widgetId))
                    .then(() => {
                        var widgetPath = pathlib.resolve(userWidgetsFolder, widgetId);

                        logger.info('Widget updated');
                        logger.info('Widget id: ', widgetId);
                        logger.info('Widget path: ', pathlib.resolve(widgetPath));
                        
                        ArchiveHelper.cleanTempData(widgetTempPath);

                        return Promise.resolve({id: widgetId, isCustom: true});
                    })
                    .catch(err => {
                        _restoreBackup(widgetId, widgetTempPath)
                        .then(() => BackendHandler.removeWidgetBackend(widgetId))
                        .then(() => BackendHandler.importWidgetBackend(widgetId))
                        .then(() => ArchiveHelper.cleanTempData(widgetTempPath));
                        throw err;
                    });
                });
    }

    function _backupWidget(widgetId, tempPath) {
        const installPath = pathlib.resolve(userWidgetsFolder, widgetId);
        const backupPath = pathlib.resolve(tempPath, 'backup');

        return new Promise((resolve, reject) => {
            fs.copy(installPath, backupPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }

    function _restoreBackup(widgetId, tempPath) {
        const installPath = pathlib.resolve(userWidgetsFolder, widgetId);
        const backupPath = pathlib.resolve(tempPath, 'backup');

        return new Promise((resolve, reject) => {
            fs.removeSync(installPath);
            fs.move(backupPath, installPath, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }

    function listWidgets() {
        const builtInWidgets = _.map(_getBuiltInWidgets(), (widget) => ({id: widget, isCustom: false}));
        const userWidgets = _.map(_getUserWidgets(), (widget) => ({id: widget, isCustom: true}));

        return Promise.resolve(_.concat(builtInWidgets, userWidgets));
    }

    function deleteWidget(widgetId) {
        const path = pathlib.resolve(userWidgetsFolder, widgetId);

        return new Promise((resolve,reject) => {
            fs.remove(path, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
        .then(() => BackendHandler.removeWidgetBackend(widgetId))
        .then(() => db.Resources.destroy({ where: {resourceId: widgetId, type: ResourceTypes.WIDGET} }));
    }

    function isWidgetUsed(widgetId) {
        return db.UserApp
            .findAll({attributes: ['appData', 'managerIp', 'username']})
            .then(userApp => {
                let result = [];
                _.forEach(userApp, function(row) {
                    let filter = _.filter(row.appData.pages, {widgets: [{definition: widgetId}]});
                    if (!_.isEmpty(filter)) {
                        result.push({username: row.username, managerIp: row.managerIp});
                    }
                });

                return result;
            });
    }

    function init() {
        try {
            logger.info('Setting up user widgets directory:', userWidgetsFolder);
            mkdirp.sync(userWidgetsFolder);
            BackendHandler.initWidgetBackends(userWidgetsFolder, builtInWidgetsFolder);
        } catch (e) {
            logger.error('Could not set up directory, error was:', e);
            process.exit(1);
        }
    }

    return {
        init,
        listWidgets,
        installWidget,
        isWidgetUsed,
        deleteWidget,
        updateWidget
    }
})();
