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
var config = require('../config').get();
var multer  = require('multer');
var request = require('request');

var logger = require('log4js').getLogger('sourceHandler');

var browseSourcesDir = pathlib.join(os.tmpdir(), config.app.source.browseSourcesDir);
var lookupYamlsDir = pathlib.join(os.tmpdir(), config.app.source.lookupYamlsDir);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        logger.debug("saving file on disk", file);

        var archiveFolder = pathlib.join(lookupYamlsDir, "archive" + Date.now());

        fs.mkdirsSync(archiveFolder);

        req.archiveFolder = archiveFolder;
        cb(null, archiveFolder);
    },
    filename: function (req, file, cb) {
        req.archiveFile = file.originalname;
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage }).single('archive');

module.exports = (function() {

    function browseArchiveTree(req, archiveUrl, lastUpdate) {
        return new Promise((resolve, reject) => {
                req.pipe(_fetchFromUrl(archiveUrl, resolve, reject));
            })
            .then(data => {
                var archiveFolder = pathlib.join(browseSourcesDir, lastUpdate + "." + data.archiveFile);
                fs.mkdirsSync(archiveFolder);
                fs.utimesSync(archiveFolder, Date.now()/1000, Date.now()/1000);

                return _removeOldExtracts(browseSourcesDir)
                    .then(() => _streamToFile(data.response, archiveFolder, data.archiveFile));
            })
            .then(data => {
                var archivePath = pathlib.join(data.archiveFolder, data.archiveFile);
                var extractedDir = pathlib.join(data.archiveFolder, "extracted");

                return _decompressArchive(archivePath, extractedDir)
                    .then(() => _scanArchive(extractedDir));
            });
    }

    function browseArchiveFile(path) {
        return new Promise((resolve, reject) => {
            var absolutePath = pathlib.join(browseSourcesDir, path);
            fs.readFile(absolutePath, 'utf-8', (err, data) => {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            });
        });
    }

    function saveMultipartData(req) {
        return new Promise((resolve, reject) => {
            upload(req, null, function (err) {
                if (err) {
                    reject(err);
                } else {
                    logger.debug("archive saved from multipart data, archiveFolder:", req.archiveFolder, "archiveFile:", req.archiveFile);
                    resolve({archiveFolder: req.archiveFolder, archiveFile: req.archiveFile});
                }
            })
        });
    }

    function saveDataFromUrl(archiveUrl) {
        return new Promise((resolve, reject) => {
                _fetchFromUrl(archiveUrl, resolve, reject, {headers: {'User-Agent': 'Cloudify'}});
            }).then(data => {
                var archiveFolder = pathlib.join(lookupYamlsDir, "archive" + Date.now());
                fs.mkdirsSync(archiveFolder);

                return _streamToFile(data.response, archiveFolder, data.archiveFile);
            });
    }

    function listYamlFiles(archiveFolder, archiveFile) {
        var archivePath = pathlib.join(archiveFolder, archiveFile);
        var extractedDir = pathlib.join(archiveFolder, "extracted");

        return _removeOldExtracts(lookupYamlsDir)
            .then(() => {
                if (_.isEmpty(archiveFile)) {
                    throw "No archive file provided";
                }
            })
            .then(() => _decompressArchive(archivePath, extractedDir))
            .then(() => _scanYamlFiles(extractedDir))
            .catch(err => {
                _cleanTempData(archiveFolder);
                throw err;
            });
    }

    function _fetchFromUrl(archiveUrl, resolve, reject, options) {
        archiveUrl = decodeURIComponent(archiveUrl.trim());

        logger.debug('fetching file from url', archiveUrl);

        return request.get(archiveUrl, options)
            .on('error', reject)
            .on('response', function (response) {
                var archiveFile = _extractFilename(response.headers['content-disposition']);

                logger.debug('filename extracted from content-disposition', archiveFile);
                if (!archiveFile) {
                    var urlExt = pathlib.extname(archiveUrl);

                    var archiveExt = ['tar', 'bz2', 'gz', 'zip'].find(function(ext) {
                        return _.includes(urlExt, ext);
                    })

                    if (archiveExt) {
                        archiveFile = "archive." + archiveExt;
                    } else {
                        return reject("Unable to determine filename from url " + archiveUrl);
                    }

                    logger.debug('filename build from url', archiveFile);
                }

                //remove not allowed characters
                archiveFile = sanitize(archiveFile);

                resolve({response, archiveFile});
            });
    }

    function _streamToFile(response, archiveFolder, archiveFile) {
        return new Promise((resolve, reject) => {
            var archivePath = pathlib.join(archiveFolder, archiveFile);

            logger.debug('streaming to file', archivePath);

            var stream = fs.createWriteStream(archivePath)
                .on('error', reject)
                .on('close', function () {
                    logger.debug("archive saved, archivePath:", archivePath);
                    resolve({archiveFolder, archiveFile});
                });

            response.pipe(stream);
        })
    }

    function _decompressArchive(archivePath, targetDir) {
        logger.debug('extracting archive', pathlib.resolve(archivePath), targetDir);

        fs.mkdirsSync(targetDir);

        return decompress(archivePath, targetDir);
    }

    function _scanYamlFiles(extractedDir) {
        logger.debug('scaning yaml files from', extractedDir);

        var items = fs.readdirSync(extractedDir);

        if (items.length === 1 && fs.statSync(pathlib.join(extractedDir, items[0])).isDirectory()) {
            items = fs.readdirSync(pathlib.join(extractedDir, items[0]));
        }

        items = _.filter(items, item => item.endsWith(".yaml") || item.endsWith(".yml"));

        return Promise.resolve(items);
    }

    function _extractFilename(contentDisposition) {
        let regexp = /filename=([^;]*)/g
        let match = regexp.exec(contentDisposition);
        if (!match) {
            return "";
        }

        return match[1];
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

    function _removeOldExtracts(tempDir) {
        const PAST_TIME = 60*60*1000; //remove archives older then 1 hour async

        fs.readdir(tempDir, function (err, files) {
            if (err) {
                logger.error(err);
                return;
            }

            files.map(function (file) {
                return pathlib.join(tempDir, file);
            }).filter(function (file) {

                var now = new Date().getTime();
                var modTime = new Date(fs.statSync(file).mtime).getTime() + PAST_TIME;

                return now > modTime;
            }).forEach(function (file) {
                fs.removeSync(file);
            });
        });

        return Promise.resolve();
    }

    function _cleanTempData(tempPath) {
        logger.debug('removing temp data', tempPath);

        fs.pathExists(tempPath).then(exists => {
            if (exists) {
                fs.remove(tempPath, err => {
                    if (err) {
                        console.error("Error removing temporary path ", tempPath);
                    }
                })
            }
        });
    }

    return {
        browseArchiveTree,
        browseArchiveFile,
        saveMultipartData,
        saveDataFromUrl,
        listYamlFiles
    }
})();
