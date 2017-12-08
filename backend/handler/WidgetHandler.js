'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var os = require('os');
var db = require('../db/Connection');
var fs = require('fs-extra');
var pathlib = require('path');
var _ = require('lodash');
var config = require('../config').get();
var ArchiveHelper = require('./ArchiveHelper');
var ResourceTypes = require('../db/types/ResourceTypes');
var BackendHandler = require('./BackendHandler');

var logger = require('log4js').getLogger('widgets');

//TODO: Temporary solution, the approach needs to be think over thoroughly
var widgetsFolder = '../widgets';
if (!fs.existsSync(widgetsFolder)) {
    widgetsFolder = '../dist/widgets';
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

    function _getInstalledWidgets() {
        return fs.readdirSync(pathlib.resolve(widgetsFolder))
            .filter(dir => fs.lstatSync(pathlib.resolve(widgetsFolder, dir)).isDirectory()
            && _.indexOf(config.app.widgets.ignoreFolders, dir) < 0);
    }

    function _validateUniqueness(widgetId) {
        var widgets = _getInstalledWidgets();
        if (_.indexOf(widgets, widgetId) >= 0) {
            return Promise.reject({status: 422, message: 'Widget ' + widgetId + ' is already installed'});
        }

        return Promise.resolve();
    }

    function _validateConsistency(widgetId, dirName) {
        if (widgetId !== widgetId) {
            return Promise.reject('Updated widget does not complies with directory name: ' + widgetId + ' <> ' + dirName);
        }

        return Promise.resolve();
    }

    function _validateWidget(widgetId, extractedDir) {
        var files = fs.readdirSync(extractedDir);

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
        logger.debug('installing widget files to the target path', pathlib.resolve(widgetsFolder));
        logger.debug('widget temp path', tempPath);

        var installPath = pathlib.resolve(widgetsFolder, widgetId);

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
                    .then(() => _persistData(widgetId, username))
                    .then(() => BackendHandler.importWidgetBackend(widgetId))
                    .then(() => {
                        var widgetPath = pathlib.resolve(widgetsFolder, widgetId);

                        logger.info('New widget installed');
                        logger.info('Widget id: ', widgetId);
                        logger.info('Widget path: ', pathlib.resolve(widgetPath));

                        ArchiveHelper.cleanTempData(widgetTempPath);

                        return Promise.resolve({id: widgetId, isCustom: true});
                    })
                    .catch(err => {
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

                return _validateConsistency(updateWidgetId, widgetId)
                    .then(() => ArchiveHelper.decompressArchive(archivePath, extractedDir))
                    .then(() => _validateWidget(widgetId, extractedDir))
                    .then(tempPath => _installFiles(widgetId, tempPath))
                    .then(() => BackendHandler.removeWidgetBackend(widgetId))
                    .then(() => BackendHandler.importWidgetBackend(widgetId))
                    .then(() => {
                        var widgetPath = pathlib.resolve(widgetsFolder, widgetId);

                        logger.info('Widget updated');
                        logger.info('Widget id: ', widgetId);
                        logger.info('Widget path: ', pathlib.resolve(widgetPath));

                        ArchiveHelper.cleanTempData(widgetTempPath);

                        return Promise.resolve({id: widgetId, isCustom: true});
                    })
                    .catch(err => {
                        ArchiveHelper.cleanTempData(widgetTempPath);
                        throw err;
                    });
                });
    }

    function listWidgets() {
        var widgets = _getInstalledWidgets();

        return db.Resources
            .findAll({where: {type: ResourceTypes.WIDGET}, attributes: ['resourceId'], raw: true})
            .then(items => _.map(items, item => item.resourceId))
            .then(ids => widgets.map(id => { return {id, isCustom: _.indexOf(ids, id) >= 0}}));
    }

    function deleteWidget(widgetId) {
        var path = pathlib.resolve(widgetsFolder, widgetId);

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

    return {
        listWidgets,
        installWidget,
        isWidgetUsed,
        deleteWidget,
        updateWidget
    }
})();
