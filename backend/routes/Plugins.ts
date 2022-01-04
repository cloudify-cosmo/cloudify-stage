import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import multer from 'multer';
import yaml from 'js-yaml';
import _ from 'lodash';
import request from 'request';
import archiver from 'archiver';
import * as ManagerHandler from '../handler/ManagerHandler';
import { getResponseJson } from '../handler/RequestHandler';

import { getLogger } from '../handler/LoggerHandler';

const defaultedRequest = request.defaults({ encoding: null });
const router = express.Router();
const upload = multer();
const logger = getLogger('Plugins');
const getFiles = (req: Request) => req.files as { [fieldname: string]: Express.Multer.File[] };

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
    return new Promise<any>((resolve, reject) => {
        defaultedRequest.get(url, (err, _res, body) => {
            if (err) {
                logger.error(`Failed downloading ${url}. ${err}`);
                reject(err);
            }
            logger.info(`Finished downloading ${url}`);
            resolve(body);
        });
    });
}

function zipFiles(
    wagonFile: string | Buffer,
    wagonFilename: string,
    yamlFile: string | Buffer,
    iconFile: string | Buffer,
    output: request.Request
) {
    return new Promise((resolve, reject) => {
        const archive = archiver('zip');
        archive.append(wagonFile, { name: wagonFilename });
        archive.append(yamlFile, { name: 'plugin.yaml' });
        if (iconFile) {
            archive.append(iconFile, { name: 'icon.png' });
        }

        archive.on('error', err => {
            logger.error(`Failed archiving plugin. ${err}`);
            reject(err);
        });

        archive.on('end', () => {
            logger.info('Finished archiving plugin');
            resolve(null);
        });

        archive.pipe(output);
        archive.finalize();
    });
}

router.get('/icons/:pluginId', (req, res) => {
    const options = {};
    ManagerHandler.updateOptions(options, 'get');
    req.pipe(
        defaultedRequest(
            `${ManagerHandler.getManagerUrl()}/resources/plugins/${req.params.pluginId}/icon.png`,
            options
        ).on(
            'response',
            // eslint-disable-next-line func-names
            function (response) {
                if (response.statusCode === 404) {
                    res.status(200).end();
                    // @ts-ignore TODO(RD-382) It will be removed, so no need to fix TS issue
                    this.abort();
                }
            }
        )
    ).pipe(res);
});

router.put('/title', upload.fields(_.map(['yaml_file'], name => ({ name, maxCount: 1 }))), (req, res) => {
    let getPluginYaml: Promise<any>;
    if (typeof req.query.yamlUrl === 'string') {
        getPluginYaml = downloadFile(req.query.yamlUrl);
    } else {
        const files = getFiles(req);
        getPluginYaml = Promise.resolve(files.yaml_file[0].buffer);
    }

    // eslint-disable-next-line camelcase
    type PluginYaml = { plugins: Record<string, { package_name: string }> };
    getPluginYaml
        .then(pluginYamlString => yaml.load(pluginYamlString) as PluginYaml)
        .then(pluginYaml =>
            res.status(200).send({
                title: _.chain(pluginYaml.plugins).values().head().get('package_name', '')
            })
        )
        .catch(() => res.status(200).send({ title: '' }));
});

interface PostUploadQuery {
    iconUrl?: string;
    title: string;
    visibility: string;
    wagonUrl?: string;
    yamlUrl?: string;
}
router.post<any, any, any, any, PostUploadQuery>(
    '/upload',
    upload.fields(_.map(['wagon_file', 'yaml_file', 'icon_file'], name => ({ name, maxCount: 1 }))),
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
            .then(([wagonFile, yamlFile, iconFile]) => {
                const uploadRequest = ManagerHandler.request(
                    'post',
                    `/plugins?visibility=${req.query.visibility}&title=${req.query.title}`,
                    {
                        'authentication-token': req.headers['authentication-token'],
                        tenant: req.headers.tenant
                    },
                    null,
                    response => {
                        getResponseJson(response)
                            .then(data => {
                                res.status(response.statusCode).send(data);
                            })
                            .catch(() => {
                                res.sendStatus(response.statusCode);
                            });
                    },
                    err => {
                        res.status(500).send({ message: err });
                    }
                );

                zipFiles(wagonFile, wagonFilename, yamlFile, iconFile, uploadRequest).catch(err => {
                    res.status(500).send({ message: `Failed zipping the plugin. ${err}` });
                });
            })
            .catch(err => {
                res.status(500).send({ message: `Failed downloading files. ${err}` });
            });
    }
);

export default router;
