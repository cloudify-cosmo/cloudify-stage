'use strict';
/**
 * Created by pposel on 24/02/2017.
 */

var _ = require('lodash');
var fs = require('fs-extra');
var pathlib = require('path');
var sanitize = require('sanitize-filename');
var decompress = require('decompress');
var multer  = require('multer');
var request = require('request');

var logger = require('log4js').getLogger('archiveHelper');

module.exports = (function() {

    function saveMultipartData(req, targetDir, multipartId) {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                logger.debug('saving file on disk', file);

                var archiveFolder = _.isFunction(targetDir) ? targetDir(file.originalname) : targetDir;

                fs.mkdirsSync(archiveFolder);

                req.archiveFolder = archiveFolder;
                cb(null, archiveFolder);
            },
            filename: function (req, file, cb) {
                req.archiveFile = file.originalname;
                cb(null, file.originalname);
            }
        });

        var upload = multer({ storage: storage }).single(multipartId);

        return new Promise((resolve, reject) => {
            upload(req, null, function (err) {
                if (err) {
                    reject(err);
                } else {
                    logger.debug('archive saved from multipart data, archiveFolder:', req.archiveFolder, 'archiveFile:', req.archiveFile);
                    resolve({archiveFolder: req.archiveFolder, archiveFile: req.archiveFile});
                }
            })
        });
    }

    function saveDataFromUrl(archiveUrl, targetDir, req, caFile) {
        return new Promise((resolve, reject) => {
            archiveUrl = decodeURIComponent(archiveUrl.trim());

            logger.debug('fetching file from url', archiveUrl);

            var options = {headers: {'User-Agent': 'Cloudify'}};
            if (caFile) {
                options.agentOptions = {
                    ca: caFile
                };
            }
            
            var getRequest = request.get(archiveUrl, options)
                .on('error', reject)
                .on('response', function (response) {
                    var archiveFile = _extractFilename(response.headers['content-disposition']);

                    logger.debug('filename extracted from content-disposition', archiveFile);
                    logger.debug('content length', response.headers['content-length']);

                    if (!archiveFile) {
                        var details = pathlib.parse(archiveUrl);

                        var archiveExt = ['tar', 'bz2', 'gz', 'zip'].find(function (ext) {
                            return _.includes(details.ext, ext);
                        })

                        if (archiveExt) {
                            archiveFile = details.base;
                        } else {
                            return reject('Unable to determine filename from url ' + archiveUrl);
                        }

                        logger.debug('filename build from url', archiveFile);
                    }

                    //remove not allowed characters
                    archiveFile = sanitize(archiveFile);

                    var archiveFolder = _.isFunction(targetDir) ? targetDir(archiveFile) : targetDir;
                    fs.mkdirsSync(archiveFolder);
                    var archivePath = pathlib.join(archiveFolder, archiveFile);

                    logger.debug('streaming to file', archivePath);

                    response.pipe(fs.createWriteStream(archivePath)
                        .on('error', reject)
                        .on('close', function () {
                            logger.debug('archive saved, archivePath:', archivePath);
                            resolve({archiveFolder, archiveFile, archivePath});
                        }));
                });

            if (req) {
                req.pipe(getRequest);
            }
        });

    }

    function _extractFilename(contentDisposition) {
        let regexp = /filename=([^;]*)/g
        let match = regexp.exec(contentDisposition);
        if (!match) {
            return '';
        }

        return match[1];
    }

    function decompressArchive(archivePath, targetDir) {
        logger.debug('extracting archive', pathlib.resolve(archivePath), targetDir);

        fs.mkdirsSync(targetDir);

        return decompress(archivePath, targetDir);
    }

    function removeOldExtracts(tempDir) {
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

    function cleanTempData(tempPath) {
        logger.debug('removing temp data', tempPath);

        return new Promise((resolve, reject) => {
            fs.pathExists(tempPath).then(exists => {
                if (exists) {
                    fs.remove(tempPath, err => {
                        if (err) {
                            console.error('Error removing temporary path ', tempPath);
                            reject();
                        } else {
                            resolve();
                        }
                    })
                } else {
                    resolve();
                }
            });
        });
    }

    return {
        saveMultipartData,
        saveDataFromUrl,
        decompressArchive,
        removeOldExtracts,
        cleanTempData
    }
})();
