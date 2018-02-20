'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var os = require('os');
var db = require('../db/Connection');
var fs = require('fs-extra');
var pathlib = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var config = require('../config').get();
var Consts = require('../consts');
var ArchiveHelper = require('./ArchiveHelper');
var ResourceTypes = require('../db/types/ResourceTypes');
var BackendHandler = require('./BackendHandler');

var logger = require('log4js').getLogger('WidgetHandler');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var builtInWidgetsFolder = pathlib.resolve('../widgets');
var userWidgetsFolder = pathlib.resolve(`..${Consts.USER_DATA_PATH}/widgets`);
if (!fs.existsSync(builtInWidgetsFolder)) {
    builtInWidgetsFolder = pathlib.resolve('../dist/widgets');
    userWidgetsFolder = pathlib.resolve(`../dist${Consts.USER_DATA_PATH}/widgets`);
}

var widgetTempDir = pathlib.join(os.tmpdir(), config.app.widgets.tempDir);

module.exports = (function() {

    function _saveMultipartData(req) {
        var targetPath = pathlib.join(widgetTempDir, 'widget' + Date.now());
        return ArchiveHelper.saveMultipartData(req, targetPath, 'widget');
    }

    function _saveDataFromUrl(archiveUrl) {
        var targetPath = pathlib.join(widgetTempDir, 'widget' + Date.now());
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
        var widgets = _getAllWidgets();
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
        var files = fs.readdirSync(extractedDir);

        //remove hidden or junk files
        files = _.filter(files, file => {
           return !file.match(/^\..+/) && file !== '__MACOSX';
        });

        if (files.length === 1 && fs.statSync(pathlib.join(extractedDir, files[0])).isDirectory()) {
            var dirName = files[0];
            if (dirName !== widgetId) {
                return Promise.reject('Incorrect widget folder name not consistent with widget id: ' + widgetId + ' <> ' + dirName);
            }

            extractedDir = pathlib.join(extractedDir, dirName);
            files = fs.readdirSync(extractedDir);
        }

        var requiredFiles = config.app.widgets.requiredFiles;
        var missingFiles = _.difference(requiredFiles, files);

        if (!_.isEmpty(missingFiles)) {
            return Promise.reject('The following files are required for widget registration: ' + _.join(missingFiles, ', '));
        } else {
            return Promise.resolve(extractedDir);
        }
    }

    function _installFiles(widgetId, tempPath) {
        logger.debug('installing widget files to the target path', pathlib.resolve(userWidgetsFolder));
        logger.debug('widget temp path', tempPath);

        var installPath = pathlib.resolve(userWidgetsFolder, widgetId);

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
                var widgetTempPath = data.archiveFolder;
                var widgetZipFile = data.archiveFile;
                var widgetId = pathlib.parse(pathlib.parse(widgetZipFile).name).name;
                var archivePath = pathlib.join(widgetTempPath, widgetZipFile);
                var extractedDir = pathlib.join(widgetTempPath, widgetId);

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
                var widgetTempPath = data.archiveFolder;
                var widgetZipFile = data.archiveFile;
                var widgetId = pathlib.parse(pathlib.parse(widgetZipFile).name).name;
                var archivePath = pathlib.join(widgetTempPath, widgetZipFile);
                var extractedDir = pathlib.join(widgetTempPath, widgetId);

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
        var installPath = pathlib.resolve(userWidgetsFolder, widgetId);
        var backupPath = pathlib.resolve(tempPath, 'backup');

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
        var installPath = pathlib.resolve(userWidgetsFolder, widgetId);
        var backupPath = pathlib.resolve(tempPath, 'backup');

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
        var builtInWidgets = _.map(_getBuiltInWidgets(), (widget) => ({id: widget, isCustom: false}));
        var userWidgets = _.map(_getUserWidgets(), (widget) => ({id: widget, isCustom: true}));

        return Promise.resolve(_.concat(builtInWidgets, userWidgets));
    }

    function deleteWidget(widgetId) {
        var path = pathlib.resolve(userWidgetsFolder, widgetId);

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
                var result = [];
                _.forEach(userApp, function(row) {
                    var filter = _.filter(row.appData.pages, {widgets: [{definition: widgetId}]});
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
