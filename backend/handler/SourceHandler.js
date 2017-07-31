'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var _ = require('lodash');
var os = require('os');
var fs = require('fs-extra');
var pathlib = require('path');
var config = require('../config').get();
var ArchiveHelper = require('./ArchiveHelper');

var logger = require('log4js').getLogger('sourceHandler');

var caFile =  null;

try {
    caFile = _.get(config,'app.ssl.ca') ? fs.readFileSync(config.app.ssl.ca) : null;
} catch (e) {
    console.error('Could not setup ssl ca, error loading file.', e);
    process.exit(1);
}

var browseSourcesDir = pathlib.join(os.tmpdir(), config.app.source.browseSourcesDir);
var lookupYamlsDir = pathlib.join(os.tmpdir(), config.app.source.lookupYamlsDir);

module.exports = (function() {

    function browseArchiveTree(req, blueprintId, version) {
        var archiveUrl = config.managerUrl + '/api/' + version + '/blueprints/' + req.params.blueprintId + '/archive';
        logger.debug('download archive from url', archiveUrl);

        var archiveFolder = pathlib.join(browseSourcesDir, 'source' + Date.now());
        return ArchiveHelper.removeOldExtracts(browseSourcesDir)
            .then(() => ArchiveHelper.saveDataFromUrl(archiveUrl, archiveFolder, req,caFile))
            .then(data => {
                var archivePath = pathlib.join(data.archiveFolder, data.archiveFile);
                var extractedDir = pathlib.join(data.archiveFolder, 'extracted');

                return ArchiveHelper.decompressArchive(archivePath, extractedDir)
                    .then(() => _scanArchive(extractedDir));
            });
    }

    function browseArchiveFile(path) {
        return new Promise((resolve, reject) => {
            var absolutePath = pathlib.resolve(browseSourcesDir, path);
            if (!_checkPrefix(absolutePath, browseSourcesDir)) {
                return reject('Wrong path');
            }

            fs.readFile(absolutePath, 'utf-8', (err, data) => {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            });
        });
    }

    function _checkPrefix(absCandidate, absPrefix) {
        return absCandidate.substring(0, absPrefix.length) === absPrefix
    }


    function _saveMultipartData(req) {
        var targetPath = pathlib.join(lookupYamlsDir, 'archive' + Date.now());
        return ArchiveHelper.saveMultipartData(req, targetPath, 'archive');
    }

    function _saveDataFromUrl(archiveUrl) {
        var targetPath = pathlib.join(lookupYamlsDir, 'archive' + Date.now());
        return ArchiveHelper.saveDataFromUrl(archiveUrl, targetPath);
    }

    function listYamlFiles(archiveUrl, req) {
        var promise = archiveUrl ? _saveDataFromUrl(archiveUrl) : _saveMultipartData(req);

        return promise.then(data => {
            var archiveFolder = data.archiveFolder;
            var archiveFile = data.archiveFile;
            var archivePath = pathlib.join(archiveFolder, archiveFile);
            var extractedDir = pathlib.join(archiveFolder, 'extracted');

            return ArchiveHelper.removeOldExtracts(lookupYamlsDir)
                .then(() => {
                    if (_.isEmpty(archiveFile)) {
                        throw 'No archive file provided';
                    }
                })
                .then(() => ArchiveHelper.decompressArchive(archivePath, extractedDir))
                .then(() => _scanYamlFiles(extractedDir))
                .catch(err => {
                    ArchiveHelper.cleanTempData(archiveFolder);
                    throw err;
                });

        });
    }

    function _scanYamlFiles(extractedDir) {
        logger.debug('scaning yaml files from', extractedDir);

        var items = fs.readdirSync(extractedDir);

        if (items.length === 1 && fs.statSync(pathlib.join(extractedDir, items[0])).isDirectory()) {
            items = fs.readdirSync(pathlib.join(extractedDir, items[0]));
        }

        items = _.filter(items, item => item.endsWith('.yaml') || item.endsWith('.yml'));

        return Promise.resolve(items);
    }

    function _scanArchive(archivePath) {
        logger.debug('scaning archive', archivePath);
        return _scanRecursive(browseSourcesDir, archivePath);
    }

    function _isUnixHiddenPath(path) {
        return (/(^|.\/)\.+[^\/\.]/g).test(path);
    }

    function _scanRecursive(root, archivePath) {
        var stats = fs.statSync(archivePath);
        var name = pathlib.basename(archivePath);

        if (stats.isSymbolicLink() || _isUnixHiddenPath(name) ) {
            return null;
        }

        const item = {
            key: archivePath.replace(pathlib.join(root, pathlib.sep), ''),
            title: name
        };

        if (stats.isFile()) {
            return item;
        } else if (stats.isDirectory()) {
            try {
                item.children = fs.readdirSync(archivePath)
                    .map(child => _scanRecursive(root, pathlib.join(archivePath, child)))
                    .filter(e => !!e);

                return item;
            } catch(ex) {
                if (ex.code == 'EACCES')
                    //User does not have permissions, ignore directory
                    return null;
            }
        } else {
            return null;
        }
    }

    return {
        browseArchiveTree,
        browseArchiveFile,
        listYamlFiles
    }
})();
