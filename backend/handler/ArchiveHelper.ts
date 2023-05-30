import fs from 'fs-extra';
import _ from 'lodash';
import multer from 'multer';
import pathlib from 'path';
import sanitize from 'sanitize-filename';
import NodeZip from 'node-stream-zip';
import type { ZipEntry, StreamZipAsync } from 'node-stream-zip';

import type { AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios';
import type { Request, Response } from 'express';
// eslint-disable-next-line import/no-unresolved,node/no-missing-import
import type { ParamsDictionary, Query } from 'express-serve-static-core';

import { getHeadersWithAuthenticationTokenFromRequest } from '../utils';
import { getLogger } from './LoggerHandler';
import * as ManagerHandler from './ManagerHandler';
import * as RequestHandler from './RequestHandler';

const logger = getLogger('ArchiveHelper');

interface ArchiveFromMultipartData {
    archiveFolder: string;
    archiveFile: string;
}

interface ArchiveFromUrl extends ArchiveFromMultipartData {
    archivePath: string;
}

type ArchiveParamsLocals = Partial<ArchiveFromMultipartData>;
type ArchiveRequest = Request<ParamsDictionary, any, any, Query, ArchiveParamsLocals>;

function getResponseLocalsFrom(req: ArchiveRequest) {
    return req.res!.locals;
}

export function saveMultipartData(
    req: ArchiveRequest,
    targetDir: string,
    multipartId: string
): Promise<ArchiveFromMultipartData> {
    const storage = multer.diskStorage({
        destination(request: ArchiveRequest, file, cb) {
            logger.debug('Saving file on disk');

            const archiveFolder = _.isFunction(targetDir) ? targetDir(file.originalname) : targetDir;

            fs.mkdirsSync(archiveFolder);

            getResponseLocalsFrom(request).archiveFolder = archiveFolder;
            cb(null, archiveFolder);
        },
        filename(request: ArchiveRequest, file, cb) {
            getResponseLocalsFrom(request).archiveFile = file.originalname;
            cb(null, file.originalname);
        }
    });

    const upload = multer({ storage }).single(multipartId);

    return new Promise<ArchiveFromMultipartData>((resolve, reject) => {
        upload(req, {} as Response, err => {
            const { archiveFolder, archiveFile } = getResponseLocalsFrom(req);
            if (err) {
                reject(err);
            } else {
                logger.debug(
                    'Archive saved from multipart data, archiveFolder:',
                    archiveFolder,
                    'archiveFile:',
                    archiveFile
                );

                // NOTE: At this point we are sure that archiveFolder and archiveFile are not undefined
                const archiveData: ArchiveFromMultipartData = {
                    archiveFolder: archiveFolder!,
                    archiveFile: archiveFile!
                };

                resolve(archiveData);
            }
        });
    });
}

function isExternalUrl(url: string) {
    // eslint-disable-next-line security/detect-unsafe-regex
    const ABSOLUTE_URL_REGEX = new RegExp('^(?:[a-z]+:)?//', 'i');

    return ABSOLUTE_URL_REGEX.test(url);
}

function extractFilename(contentDisposition: string) {
    const regexp = /filename=([^;]*)/g;
    const match = regexp.exec(contentDisposition);
    if (!match) {
        return '';
    }

    return match[1];
}

const userAgentHeader: AxiosRequestHeaders = { 'User-Agent': 'Node.js' };

export function saveDataFromUrl(url: string, targetDir: string, req?: Request) {
    return new Promise<ArchiveFromUrl>((resolve, reject) => {
        const archiveUrl = decodeURIComponent(url.trim());

        logger.debug('Fetching file from url', archiveUrl);

        let getRequest = null;
        const onErrorFetch = reject;

        const onSuccessFetch = (response: AxiosResponse) => {
            let archiveFile = extractFilename(response.headers['content-disposition']);

            logger.debug('Filename extracted from content-disposition', archiveFile);
            logger.debug('Content length', response.headers['content-length']);

            if (!archiveFile) {
                const details = pathlib.parse(archiveUrl);

                const archiveExt = ['tar', 'bz2', 'gz', 'zip'].find(ext => _.includes(details.ext, ext));

                if (archiveExt) {
                    archiveFile = details.base;
                } else {
                    reject(`Unable to determine filename from url ${archiveUrl}`);
                    return;
                }

                logger.debug('Filename build from url', archiveFile);
            }

            // remove not allowed characters
            archiveFile = sanitize(archiveFile);

            const archiveFolder = _.isFunction(targetDir) ? targetDir(archiveFile) : targetDir;
            fs.mkdirsSync(archiveFolder);
            const archivePath = pathlib.join(archiveFolder, archiveFile);

            logger.debug('Streaming to file', archivePath);

            response.data.pipe(
                fs
                    .createWriteStream(archivePath)
                    .on('error', reject)
                    .on('close', () => {
                        logger.debug('archive saved, archivePath:', archivePath);
                        resolve({ archiveFolder, archiveFile, archivePath });
                    })
            );
        };

        const options: AxiosRequestConfig = { headers: userAgentHeader, responseType: 'stream' };
        if (isExternalUrl(archiveUrl)) {
            getRequest = RequestHandler.request('GET', archiveUrl, options);
        } else {
            if (req) {
                options.headers = getHeadersWithAuthenticationTokenFromRequest(req, {
                    ...(<AxiosRequestHeaders>req?.headers),
                    ...userAgentHeader
                });
            }
            getRequest = ManagerHandler.request('GET', archiveUrl, options);
        }

        getRequest.then(onSuccessFetch).catch(onErrorFetch);
    });
}

export function storeSingleYamlFile(archivePath: string, archiveFile: string, targetDir: string) {
    logger.debug('Storing single YAML file', pathlib.resolve(archivePath), targetDir);

    fs.mkdirsSync(targetDir);
    fs.renameSync(archivePath, pathlib.join(targetDir, archiveFile));

    return {};
}

export function decompressArchive(archivePath: string | Buffer, targetDir?: string): StreamZipAsync {
    logger.debug(
        'Extracting archive',
        typeof archivePath === 'string' ? pathlib.resolve(archivePath) : 'from buffer',
        targetDir
    );

    // eslint-disable-next-line
    return new NodeZip.async({
        // TODO Norbert: check if buffor is working
        file: archivePath as string
    });
}

export async function extractEntriesFromArchive(archivePath: string | Buffer, targetDir?: string): Promise<ZipEntry[]> {
    const decompressedArchive = decompressArchive(archivePath, targetDir);

    if (targetDir) {
        fs.ensureDirSync(targetDir);
        await decompressedArchive.extract(null, targetDir);
    }

    const entriesObject = await decompressedArchive.entries();
    return Object.values(entriesObject);
}

export function removeOldExtracts(tempDir: string) {
    const PAST_TIME = 60 * 60 * 1000; // remove archives older then 1 hour async

    fs.readdir(tempDir, (err, files) => {
        if (err) {
            logger.warn('Cannot remove old extracts. Error:', err);
            return;
        }

        files
            .map(file => pathlib.join(tempDir, file))
            .filter(file => {
                const now = new Date().getTime();
                const modTime = new Date(fs.statSync(file).mtime).getTime() + PAST_TIME;

                return now > modTime;
            })
            .forEach(file => {
                fs.removeSync(file);
            });
    });

    return Promise.resolve();
}

export function cleanTempData(tempPath: string) {
    logger.debug('Removing temporary data from', tempPath);

    return new Promise((resolve, reject) => {
        fs.pathExists(tempPath)
            .then(exists => {
                if (exists) {
                    fs.remove(tempPath, err => {
                        if (err) {
                            const errorMessage = `Error removing temporary path ${tempPath}: ${err}`;
                            logger.error(errorMessage);
                            reject(errorMessage);
                        } else {
                            resolve(null);
                        }
                    });
                } else {
                    resolve(null);
                }
            })
            .catch(reject);
    });
}
