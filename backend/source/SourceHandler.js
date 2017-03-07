'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var _ = require('lodash');
var os = require('os');
var fs = require('fs-extra');
var pathlib = require('path');
var sanitize = require('sanitize-filename');
var decompress = require('decompress');
var pify = require('pify');
var config = require('../config');
var fsp = pify(fs);

var logger = require('log4js').getLogger('sourceHandler');

module.exports = (function() {

    function _getRootFolder() {
        return pathlib.join(os.tmpdir(), config.get().app.extractedSourcesDir);
    }

    function browseArchiveTree(lastUpdate, contentDisposition, callback) {
        var rootFolder = _getRootFolder();
        fs.mkdirsSync(rootFolder);

        var filename = _extractFilename(contentDisposition);

        logger.debug('download archive', contentDisposition);

        if (!filename) {
            return callback("Unknown file name taken from Content Disposition " + contentDisposition);
        }

        //remove not allowed characters
        filename = sanitize(filename);

        var archiveFolder = pathlib.join(rootFolder, lastUpdate + "." + filename);
        var extractedFolder = pathlib.join(archiveFolder, "extracted");
        fs.mkdirsSync(extractedFolder);
        fs.utimesSync(archiveFolder, Date.now()/1000, Date.now()/1000);

        _removeOldArchives();

        var archiveFilepath = pathlib.join(archiveFolder, filename);
        var stream = fs.createWriteStream(archiveFilepath)
            .on('error', function (err) {
                callback(err);
            })
            .on('close', function () {
                _decompressArchive(archiveFilepath, extractedFolder, callback);
            });

        return stream;
    }

    function _extractFilename(contentDisposition) {
        let regexp = /filename=([^;]*)/g
        let match = regexp.exec(contentDisposition);
        if (!match) {
            return "";
        }

        return match[1];
    }

    function _decompressArchive(archivePath, extractFolder, callback) {
        logger.debug('extracting', archivePath, extractFolder);

        decompress(archivePath, extractFolder).then(files => {
            let tree = _scanArchive(extractFolder);
            callback(null, tree);
        }).catch(err=> {
            callback(err);
        });
    }

    function _scanArchive(archivePath) {
        logger.debug('scan archive', archivePath);

        return _scanRecursive(_getRootFolder(), archivePath);
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
            key: archivePath.replace(pathlib.join(root, pathlib.sep), ""),
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
                if (ex.code == "EACCES")
                    //User does not have permissions, ignore directory
                    return null;
            }
        } else {
            return null;
        }
    }

    function _removeOldArchives() {
        const PAST_TIME = 60*60*1000; //remove archives older then 1 hour

        var rootFolder = _getRootFolder();
        fs.readdir(_getRootFolder(), function (err, files) {
            if (err) {
                logger.error(err);
                return;
            }

            files.map(function (file) {
                return pathlib.join(rootFolder, file);
            }).filter(function (file) {

                var now = new Date().getTime();
                var modTime = new Date(fs.statSync(file).mtime).getTime() + PAST_TIME;

                return now > modTime;
            }).forEach(function (file) {
                fs.removeSync(file);
            });
        });
    }

    function browseArchiveFile(path, callback) {
        var absolutePath = pathlib.join(_getRootFolder(), path);
        fsp.readFile(absolutePath, 'utf-8').then(function(content) {
            callback(null, content);
        }).catch(function(err){
            callback(err);
        });
    }

    return {
        browseArchiveTree,
        browseArchiveFile
    }
})();
