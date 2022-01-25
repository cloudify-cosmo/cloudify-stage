import _, { escapeRegExp, trimEnd } from 'lodash';
import decompress, { File } from 'decompress';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import express from 'express';
import fs from 'fs';
import path from 'path';
import request from 'request';
import { STATUS_CODES } from 'http';
import { getLogger } from '../handler/LoggerHandler';
import type { RequestBody } from './Terraform.types';

const logger = getLogger('Terraform');
const router = express.Router();
const templatePath = path.resolve(__dirname, '../templates/terraform');
const template = fs.readFileSync(path.resolve(templatePath, 'blueprint.ejs'), 'utf8');

router.use(bodyParser.json());

router.post('/resources', (req, res) => {
    const { zipUrl } = req.query;

    request.get(
        { url: zipUrl as string, encoding: null, headers: { Authorization: req.get('Authorization') } },
        (err, zipRes, body) => {
            if (err) {
                logger.error(`Error while fetching zip file: ${err}`);
                if (zipRes) {
                    const statusCode = zipRes.statusCode >= 400 && zipRes.statusCode < 500 ? zipRes.statusCode : 400;
                    res.status(statusCode).send({
                        message: `The URL is not accessible - Error ${zipRes.statusCode} ${
                            STATUS_CODES[zipRes.statusCode]
                        }`
                    });
                } else {
                    res.status(400).send({
                        message: 'The URL is not accessible'
                    });
                }
                return;
            }

            decompress(body)
                .then((files: File[]) => {
                    const modules = _(files)
                        .filter({ type: 'directory' })
                        .map('path')
                        .filter(directory =>
                            files.some(
                                file =>
                                    file.type === 'file' && file.path.match(`^${escapeRegExp(directory)}[^/]+\\.tf$`)
                            )
                        )
                        .map(directory => trimEnd(directory, '/'))
                        .sort()
                        .value();

                    if (modules.length) res.send(modules);
                    else res.status(400).send({ message: "Couldn't find a Terraform module in the provided package" });
                })
                .catch((decompressErr: any) => {
                    logger.error(`Error while decompressing zip file:`, decompressErr);
                    res.status(400).send({ message: 'The URL does not point to a valid ZIP file' });
                });
        }
    );
});

router.post('/blueprint', (req, res) => {
    const {
        blueprintName,
        terraformVersion,
        terraformTemplate,
        resourceLocation,
        urlAuthentication,
        variables = [],
        environmentVariables = [],
        outputs = []
    }: RequestBody = req.body;

    logger.debug(
        `Generating Terraform blueprint using: version=${terraformVersion}, template=${terraformTemplate}, location=${resourceLocation}.`
    );

    let result;
    try {
        result = ejs.render(
            template,
            {
                blueprintName,
                terraformVersion,
                terraformTemplate,
                urlAuthentication,
                resourceLocation,
                variables,
                environmentVariables,
                outputs
            },
            {
                views: [templatePath]
            }
        );
    } catch (err) {
        logger.error(err);
        res.status(500).send({ message: `Error when generating blueprint` });
    }

    res.setHeader('content-type', 'text/x-yaml');
    res.send(result);
});

export default router;
