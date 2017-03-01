'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var _ = require('lodash');
var request = require('request');
var os = require('os');
var fs = require('fs-extra');
var path = require('path');
var sanitize = require('sanitize-filename');
var Decompress = require('decompress');
var unzip = require('unzip');
var walk = require('walk');
var dirTree = require('directory-tree');
var config = require('../config');

var logger = require('log4js').getLogger('browseBlueprintHandler');

module.exports = (function() {

    function _extractFilename(contentDisposition) {
        let regexp = /filename=([^;]*)/g
        let match = regexp.exec(contentDisposition);
        if (!match) {
            return "";
        }

        return match[1];
    }

    function _getRootFolder() {
        return path.join(os.tmpdir(), config.get().app.blueprintsArchiveDir);
    }

    function _downloadArchive(tmpDir, req, res, next) {
        var archiveUrl = decodeURIComponent(req.query.su);
        logger.debug('download archive from url', archiveUrl);

        req.pipe(request.get(archiveUrl))
            .on('error', function (err) {
                next(err);
            })
            .on('response', function (response) {
                var cd = response.headers['content-disposition'];
                var blueprintFilename = _extractFilename(cd);

                logger.debug('download archive', cd);

                if (!blueprintFilename) {
                    return next("Unknown blueprint file name taken from Content Disposition " + cd);
                }

                blueprintFilename = sanitize(blueprintFilename);

                var archiveFolder = path.join(tmpDir, req.query.last_update + "." + blueprintFilename);
                var extractedFolder = path.join(archiveFolder, "extracted");
                fs.mkdirsSync(extractedFolder);
                fs.utimesSync(archiveFolder, Date.now()/1000, Date.now()/1000);

                _removeOldArchives();

                var archiveFilepath = path.join(archiveFolder, blueprintFilename);
                var file = fs.createWriteStream(archiveFilepath)
                    .on('error', function (err) {
                        next(err);
                    })
                    .on('close', function () {
                        _extractArchive(archiveFilepath, extractedFolder, res, next);
                    });

                response.pipe(file);
            });
    }

    function _extractArchive(archivePath, extractFolder, res, next) {
        logger.debug('extracting', archivePath, extractFolder);

        var decompress = new Decompress().src(archivePath).dest(extractFolder);
        if (_.endsWith(archivePath, 'tar.gz') || _.endsWith(archivePath, 'tgz')) {
            decompress.use(Decompress.targz());
        } else if (_.endsWith(archivePath, 'tar')) {
            decompress.use(Decompress.tar());
        } else if (_.endsWith(archivePath, 'zip')) {
            fs.createReadStream(archivePath)
                .on('error', function (err) {
                    return next(err);
                })
                .pipe(unzip.Extract({path: extractFolder}))
                .on('close',function(data) {
                    let tree = _scanArchive(extractFolder);
                    res.send(tree);
                });

            return;
        } else if (_.endsWith(archivePath, 'tar.bz2')) {
            decompress.use(Decompress.tarbz2());
        } else {
            throw 'unknown compression type for file [' + path.extname(archivePath)  + ']';
        }

        decompress.run(function(data) {
            let tree = _scanArchive(extractFolder);
            res.send(tree);
        });
    }

    function _isUnixHiddenPath(path) {
        return (/(^|.\/)\.+[^\/\.]/g).test(path);
    }

    function _scanRecursive(root, archivePath) {
        var stats = fs.statSync(archivePath);
        var name = path.basename(archivePath);

        if (stats.isSymbolicLink() || _isUnixHiddenPath(name) ) {
            return null;
        }

        const item = {
            key: archivePath.replace(path.join(root, path.sep), ""),
            title: name
        };

        if (stats.isFile()) {
            // Nothing
        } else if (stats.isDirectory()) {
            try {
                item.children = fs.readdirSync(archivePath)
                    .map(child => _scanRecursive(root, path.join(archivePath, child)))
                    .filter(e => !!e);
            } catch(ex) {
                if (ex.code == "EACCES")
                    //User does not have permissions, ignore directory
                    return null;
            }
        } else {
            return null;
        }
        return item;
    }

    function _scanArchive(archivePath) {
        logger.debug('scan archive', archivePath);

        return _scanRecursive(_getRootFolder(), archivePath);
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
                return path.join(rootFolder, file);
            }).filter(function (file) {

                var now = new Date().getTime();
                var modTime = new Date(fs.statSync(file).mtime).getTime() + PAST_TIME;

                return now > modTime;
            }).forEach(function (file) {
                fs.removeSync(file);
            });
        });
    }

    function browseArchiveTree(req, res, next) {
        try {
            logger.debug('validate params');
            var errors = [];
            if (!req.query.su) {
                errors.push('no server url passed [su]');
            }
            if (!req.query.last_update) {
                errors.push('no last update passed [last_update]');
            }

            if (errors.length > 0) {
                return next(errors.join());
            }

            var rootFolder = _getRootFolder();
            fs.mkdirsSync(rootFolder);

            _downloadArchive(rootFolder, req, res, next);
        } catch(err) {
            return next(err);
        }
    }

    function browseArchiveFile(req, res, next) {
        try {
            logger.debug('validate params');
            var errors = [];
            if (!req.query.path) {
                errors.push('no file path passed [path]');
            }
            if (errors.length > 0) {
                return next(errors.join());
            }

            var filePath = path.join(_getRootFolder(), req.query.path);
            fs.readFile(filePath, 'utf-8', function(err, data) {
                if (err) {
                    return next(err);
                }

                res.contentType('application/text').send(data);
            });
        } catch(err) {
            return next(err);
        }
    }

    return {
        browseArchiveTree,
        browseArchiveFile
    }
})();
