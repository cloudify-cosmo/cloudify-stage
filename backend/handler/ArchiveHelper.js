/**
 * Created by pposel on 24/02/2017.
 */

const _ = require('lodash');
const fs = require('fs-extra');
const pathlib = require('path');
const sanitize = require('sanitize-filename');
const decompress = require('decompress');
const multer = require('multer');
const ManagerHandler = require('./ManagerHandler');
const RequestHandler = require('./RequestHandler');

const logger = require('./LoggerHandler').getLogger('ArchiveHelper');

module.exports = (function() {
    function saveMultipartData(req, targetDir, multipartId) {
        const storage = multer.diskStorage({
            destination(req, file, cb) {
                logger.debug('Saving file on disk');

                const archiveFolder = _.isFunction(targetDir) ? targetDir(file.originalname) : targetDir;

                fs.mkdirsSync(archiveFolder);

                req.archiveFolder = archiveFolder;
                cb(null, archiveFolder);
            },
            filename(req, file, cb) {
                req.archiveFile = file.originalname;
                cb(null, file.originalname);
            }
        });

        const upload = multer({ storage }).single(multipartId);

        return new Promise((resolve, reject) => {
            upload(req, null, function(err) {
                if (err) {
                    reject(err);
                } else {
                    logger.debug(
                        'Archive saved from multipart data, archiveFolder:',
                        req.archiveFolder,
                        'archiveFile:',
                        req.archiveFile
                    );
                    resolve({ archiveFolder: req.archiveFolder, archiveFile: req.archiveFile });
                }
            });
        });
    }

    function saveDataFromUrl(archiveUrl, targetDir, req) {
        return new Promise((resolve, reject) => {
            const HEADERS = { 'User-Agent': 'Cloudify' };
            archiveUrl = decodeURIComponent(archiveUrl.trim());

            logger.debug('Fetching file from url', archiveUrl);

            let getRequest = null;
            const onErrorFetch = function(error) {
                reject(error);
            };
            const onSuccessFetch = function(response) {
                let archiveFile = _extractFilename(response.headers['content-disposition']);

                logger.debug('Filename extracted from content-disposition', archiveFile);
                logger.debug('Content length', response.headers['content-length']);

                if (!archiveFile) {
                    const details = pathlib.parse(archiveUrl);

                    const archiveExt = ['tar', 'bz2', 'gz', 'zip'].find(function(ext) {
                        return _.includes(details.ext, ext);
                    });

                    if (archiveExt) {
                        archiveFile = details.base;
                    } else {
                        return reject(`Unable to determine filename from url ${archiveUrl}`);
                    }

                    logger.debug('Filename build from url', archiveFile);
                }

                // remove not allowed characters
                archiveFile = sanitize(archiveFile);

                const archiveFolder = _.isFunction(targetDir) ? targetDir(archiveFile) : targetDir;
                fs.mkdirsSync(archiveFolder);
                const archivePath = pathlib.join(archiveFolder, archiveFile);

                logger.debug('Streaming to file', archivePath);

                response.pipe(
                    fs
                        .createWriteStream(archivePath)
                        .on('error', reject)
                        .on('close', function() {
                            logger.debug('archive saved, archivePath:', archivePath);
                            resolve({ archiveFolder, archiveFile, archivePath });
                        })
                );
            };

            if (_isExternalUrl(archiveUrl)) {
                const options = { options: { headers: HEADERS } };
                getRequest = RequestHandler.request('GET', archiveUrl, options, onSuccessFetch, onErrorFetch);
            } else {
                getRequest = ManagerHandler.request('GET', archiveUrl, HEADERS, null, onSuccessFetch, onErrorFetch);
            }

            if (req) {
                req.pipe(getRequest);
            }
        });
    }

    function _isExternalUrl(url) {
        const ABSOLUTE_URL_REGEX = new RegExp('^(?:[a-z]+:)?//', 'i');

        return ABSOLUTE_URL_REGEX.test(url);
    }

    function _extractFilename(contentDisposition) {
        const regexp = /filename=([^;]*)/g;
        const match = regexp.exec(contentDisposition);
        if (!match) {
            return '';
        }

        return match[1];
    }

    function storeSingleYamlFile(archivePath, archiveFile, targetDir) {
        logger.debug('Storing single YAML file', pathlib.resolve(archivePath), targetDir);

        fs.mkdirsSync(targetDir);
        fs.renameSync(archivePath, pathlib.join(targetDir, archiveFile));

        return {};
    }

    function decompressArchive(archivePath, targetDir) {
        logger.debug('Extracting archive', pathlib.resolve(archivePath), targetDir);

        fs.mkdirsSync(targetDir);

        return decompress(archivePath, targetDir);
    }

    function removeOldExtracts(tempDir) {
        const PAST_TIME = 60 * 60 * 1000; // remove archives older then 1 hour async

        fs.readdir(tempDir, function(err, files) {
            if (err) {
                logger.warn('Cannot remove old extracts. Error:', err);
                return;
            }

            files
                .map(function(file) {
                    return pathlib.join(tempDir, file);
                })
                .filter(function(file) {
                    const now = new Date().getTime();
                    const modTime = new Date(fs.statSync(file).mtime).getTime() + PAST_TIME;

                    return now > modTime;
                })
                .forEach(function(file) {
                    fs.removeSync(file);
                });
        });

        return Promise.resolve();
    }

    function cleanTempData(tempPath) {
        logger.debug('Removing temporary data from', tempPath);

        return new Promise((resolve, reject) => {
            fs.pathExists(tempPath).then(exists => {
                if (exists) {
                    fs.remove(tempPath, err => {
                        if (err) {
                            const errorMessage = `Error removing temporary path ${tempPath}: ${err}`;
                            logger.error(errorMessage);
                            reject(errorMessage);
                        } else {
                            resolve();
                        }
                    });
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
        storeSingleYamlFile,
        removeOldExtracts,
        cleanTempData
    };
})();
