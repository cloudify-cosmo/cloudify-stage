import archiver from 'archiver';
import type { AxiosRequestHeaders } from 'axios';
import axios from 'axios';
import type { NextFunction, Request, Response } from 'express';
import express from 'express';
import yaml from 'js-yaml';
import _ from 'lodash';
import multer from 'multer';

import { getLogger } from '../handler/LoggerHandler';
import * as ManagerHandler from '../handler/ManagerHandler';
import { forward, getResponseForwarder, requestAndForwardResponse } from '../handler/RequestHandler';
import { getHeadersWithAuthenticationTokenFromRequest } from '../utils';
import type {
    PostPluginsUploadQueryParams,
    PutPluginsTitleRequestQueryParams,
    PutPluginsTitleResponse
} from './Plugins.types';
import type { GenericErrorResponse } from '../types';

const router = express.Router();
const upload = multer();
const logger = getLogger('Plugins');
const getFiles = (req: Request<any, any, any, any, any>) => req.files as { [fieldname: string]: Express.Multer.File[] };

function checkParams(req: Request, res: Response, next: NextFunction) {
    const files = getFiles(req);
    const noWagon = files && _.isEmpty(files.wagon_file) && !req.query.wagonUrl;
    const noYaml = files && _.isEmpty(files.yaml_file) && !req.query.yamlUrl;

    if (noWagon) {
        const errorMessage = 'Must provide a wagon file or url.';
        logger.error(errorMessage);
        res.status(500).send({ message: errorMessage });
    } else if (noYaml) {
        const errorMessage = 'Must provide a yaml file or url.';
        logger.error(errorMessage);
        res.status(500).send({ message: errorMessage });
    } else {
        next();
    }
}

function downloadFile(url: string) {
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
    wagonFile: string | Buffer,
    wagonFilename: string,
    yamlFiles: Record<string, string | Buffer>,
    iconFile: string | Buffer,
    onError: (err: any) => void
) {
    const archive = archiver('zip');
    archive.append(wagonFile, { name: wagonFilename });
    Object.entries(yamlFiles).forEach(([yamlFileName, content]) => {
        archive.append(content, { name: yamlFileName });
    });

    if (iconFile) {
        archive.append(iconFile, { name: 'icon.png' });
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
    upload.fields(_.map(['wagon_file', 'yaml_files', 'icon_file'], name => ({ name, maxCount: 1 }))),
    checkParams,
    (req, res) => {
        const files = getFiles(req);
        const promises = [];
        let wagonFilename = '';

        if (req.query.wagonUrl) {
            promises.push(downloadFile(req.query.wagonUrl));
            wagonFilename = _.last(req.query.wagonUrl.split('/')) || '';
        } else {
            promises.push(Promise.resolve(files.wagon_file[0].buffer));
            wagonFilename = files.wagon_file[0].originalname;
        }

        if (req.query.yamlUrl) {
            promises.push(downloadFile(req.query.yamlUrl));
        } else {
            promises.push(Promise.resolve(files.yaml_file[0].buffer));
        }

        if (req.query.iconUrl) {
            promises.push(downloadFile(req.query.iconUrl));
        } else if (_.get(req.files, 'icon_file')) {
            promises.push(Promise.resolve(files.icon_file[0].buffer));
        } else {
            promises.push(null);
        }

        Promise.all(promises)
            .then(([wagonFile, yamlFiles, iconFile]) => {
                const zipStream = zipFiles(wagonFile, wagonFilename, yamlFiles, iconFile, err =>
                    res.status(500).send({ message: `Failed zipping the plugin. ${err}` })
                );

                ManagerHandler.request('post', `/plugins?visibility=${req.query.visibility}&title=${req.query.title}`, {
                    headers: getHeadersWithAuthenticationTokenFromRequest(req, {
                        tenant: req.headers.tenant as string,
                        'content-type': 'application/zip'
                    }),
                    responseType: 'stream',
                    data: zipStream,
                    maxBodyLength: Infinity
                })
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
