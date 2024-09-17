import archiver from 'archiver';
import type { AxiosRequestHeaders } from 'axios';
import axios from 'axios';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import yaml from 'js-yaml';
import _ from 'lodash';
import multer from 'multer';
import path from 'path';
import isEmpty from 'lodash/isEmpty';
import compact from 'lodash/compact';
import { getLogger } from '../handler/LoggerHandler';
import * as ManagerHandler from '../handler/ManagerHandler';
import { forward, getResponseForwarder, requestAndForwardResponse } from '../handler/RequestHandler';
import { getHeadersWithAuthenticationTokenFromRequest } from '../utils';
import type {
    PluginFileDetails,
    PostPluginsUploadQueryParams,
    PutPluginsTitleRequestQueryParams,
    PutPluginsTitleResponse
} from './Plugins.types';
import type { GenericErrorResponse } from '../types';

const router = express.Router();
const upload = multer();
const logger = getLogger('Plugins');
const getFiles = (req: Request<any, any, any, any, any>) => req.files as { [fieldname: string]: Express.Multer.File[] };

const getYamlUrls = (yamlUrl?: string | string[]) => {
    if (typeof yamlUrl === 'string' && yamlUrl) {
        return [yamlUrl];
    }

    return Array.isArray(yamlUrl) ? yamlUrl : [];
};

const getFilename = (yamlUrl: string) => path.basename(yamlUrl);

const getFileDetails = async (fileSource: Buffer | string, filename = '') => {
    if (fileSource instanceof Buffer) {
        return {
            file: fileSource,
            name: filename
        };
    }

    const fileBuffer = await downloadFile(fileSource);

    return {
        file: fileBuffer,
        name: filename || getFilename(fileSource)
    };
};

function checkParams(req: Request, res: Response, next: NextFunction) {
    const files = getFiles(req);
    const noWagon = files && _.isEmpty(files.wagon_file) && !req.query.wagonUrl;
    const noYamls = files && _.isEmpty(files.yaml_file) && !req.query.yamlUrl;

    if (noWagon) {
        const errorMessage = 'Must provide a wagon file or url.';
        logger.error(errorMessage);
        res.status(500).send({ message: errorMessage });
    } else if (noYamls) {
        const errorMessage = 'Must provide a yaml file or url(s).';
        logger.error(errorMessage);
        res.status(500).send({ message: errorMessage });
    } else {
        next();
    }
}

function downloadFile(url: string): Promise<Buffer> {
    return axios(url, { responseType: 'arraybuffer' })
        .then(({ data }) => {
            logger.info(`Finished downloading ${url}`);
            return data;
        })
        .catch(err => {
            logger.error(`Failed downloading ${url}. ${err}`);
            throw err;
        });
}

function zipFiles(
    wagonFile: PluginFileDetails,
    yamlFiles: Array<PluginFileDetails>,
    iconFile: PluginFileDetails,
    onError: (err: unknown) => void
) {
    const archive = archiver('zip');

    if (wagonFile) {
        archive.append(wagonFile.file, { name: wagonFile.name });
    }

    if (!isEmpty(compact(yamlFiles))) {
        yamlFiles.forEach(fileDetails => archive.append(fileDetails!.file, { name: fileDetails!.name }));
    }

    if (iconFile) {
        archive.append(iconFile.file, { name: iconFile.name });
    }

    archive.on('error', onError);
    archive.finalize().catch(onError);

    return archive;
}

router.get('/icons/:pluginId', (req, res) => {
    const options = {
        headers: getHeadersWithAuthenticationTokenFromRequest(req, req.headers as AxiosRequestHeaders)
    };
    ManagerHandler.setManagerSpecificOptions(options, 'get');
    requestAndForwardResponse(
        `${ManagerHandler.getManagerUrl()}/resources/plugins/${req.params.pluginId}/icon.png`,
        res,
        options
    ).catch(err => {
        if (err.response?.status === 404) {
            res.status(200).end();
        } else if (err.response?.status === 304) {
            res.status(304).end();
        } else {
            logger.error(err.message);
            res.status(500).end();
        }
    });
});

router.put(
    '/title',
    upload.fields(_.map(['yaml_file'], name => ({ name, maxCount: 1 }))),
    (
        req: Request<never, PutPluginsTitleResponse, any, PutPluginsTitleRequestQueryParams>,
        res: Response<PutPluginsTitleResponse>
    ) => {
        let getPluginYaml: Promise<any>;

        if (typeof req.query.yamlUrl === 'string') {
            getPluginYaml = downloadFile(req.query.yamlUrl);
        } else {
            const files = getFiles(req);
            getPluginYaml = Promise.resolve(files.yaml_file[0].buffer);
        }

        // eslint-disable-next-line camelcase
        type PluginYaml = { plugins: Record<string, { package_name?: string }> };
        getPluginYaml
            .then(pluginYamlString => yaml.load(pluginYamlString) as PluginYaml)
            .then(pluginYaml =>
                res.status(200).send({
                    title: _.chain(pluginYaml.plugins).values().head().value()?.package_name || ''
                })
            )
            .catch(() => res.status(200).send({ title: '' }));
    }
);

router.post<never, any | GenericErrorResponse, any, PostPluginsUploadQueryParams & Record<string, string>>(
    '/upload',
    upload.fields(_.map(['wagon_file', 'yaml_file', 'icon_file'], name => ({ name, maxCount: 1 }))),
    checkParams,
    (req, res) => {
        const files = getFiles(req);
        const promises = [];

        if (req.query.wagonUrl) {
            promises.push(getFileDetails(req.query.wagonUrl));
        } else {
            promises.push(getFileDetails(files.wagon_file[0].buffer, files.wagon_file[0].originalname));
        }

        if (req.query.iconUrl) {
            promises.push(getFileDetails(req.query.iconUrl, 'icon.png'));
        } else if (_.get(req.files, 'icon_file')) {
            promises.push(getFileDetails(files.icon_file[0].buffer, 'icon.png'));
        } else {
            promises.push(undefined);
        }

        const yamlUrls = getYamlUrls(req.query.yamlUrl);
        if (!isEmpty(yamlUrls)) {
            yamlUrls.forEach(yamlUrl => promises.push(getFileDetails(yamlUrl)));
        } else {
            promises.push(getFileDetails(files.yaml_file[0].buffer, 'plugin.yaml'));
        }

        Promise.all(promises)
            .then(([wagonFile, iconFile, ...yamlFiles]) => {
                const zipStream = zipFiles(wagonFile, yamlFiles, iconFile, err =>
                    res.status(500).send({ message: `Failed zipping the plugin. ${err}` })
                );

                ManagerHandler.request(
                    'post',
                    `/plugins?visibility=${req.query.visibility}&title=${req.query.title}`,
                    {
                        headers: getHeadersWithAuthenticationTokenFromRequest(req, {
                            tenant: req.headers.tenant as string,
                            'content-type': 'application/zip'
                        }),
                        responseType: 'stream',
                        data: zipStream,
                        maxBodyLength: Infinity
                    },
                    60000
                )
                    .then(getResponseForwarder(res))
                    .catch(err =>
                        err.response ? forward(err.response, res) : res.status(500).send({ message: err.message })
                    );
            })
            .catch(err => {
                res.status(500).send({ message: `Failed downloading files. ${err.message}` });
            });
    }
);

export default router;
