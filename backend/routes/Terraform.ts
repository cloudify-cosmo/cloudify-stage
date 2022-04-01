import _, { escapeRegExp, trimEnd } from 'lodash';
import decompress, { File } from 'decompress';
import bodyParser from 'body-parser';
import ejs from 'ejs';
import express from 'express';
import type { Request } from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import { STATUS_CODES } from 'http';
import Git from 'nodegit';
import type { Error } from 'nodegit';
import uniqueDirectoryName from 'short-uuid';
import directoryTree from 'directory-tree';
import { getLogger } from '../handler/LoggerHandler';
import type { RequestBody } from './Terraform.types';

const logger = getLogger('Terraform');
const router = express.Router();
const templatePath = path.resolve(__dirname, '../templates/terraform');
const template = fs.readFileSync(path.resolve(templatePath, 'blueprint.ejs'), 'utf8');

router.use(bodyParser.json());

type ResourcesRequest = Request<
    unknown,
    unknown,
    unknown,
    {
        templateUrl: string;
    }
>;
router.post('/resources', async (req: ResourcesRequest, res) => {
    const { templateUrl } = req.query;
    const authHeader = req.get('Authorization');
    const isGitFile = templateUrl.endsWith('.git');

    const scanZipFile = async () => {
        return axios(templateUrl, {
            responseType: 'arraybuffer',
            headers: authHeader ? { Authorization: authHeader } : {}
        }).then(response =>
            decompress(response.data)
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
                })
        );
    };

    const getGitCredentials = () => {
        if (authHeader) {
            const encodedCredentials = authHeader.replace('Basic ', '');
            const gitCredentials = Buffer.from(encodedCredentials, 'base64').toString('binary');
            const [username, personalToken] = gitCredentials.split(':');
            return Git.Cred.userpassPlaintextNew(username, personalToken);
        }

        return undefined;
    };

    const scanGitFile = async () => {
        const repositoryPath = path.join(os.tmpdir(), uniqueDirectoryName.generate());
        const terraformModuleDirectories: string[] = [];

        try {
            await Git.Clone.clone(templateUrl, repositoryPath, {
                fetchOpts: {
                    callbacks: {
                        certificateCheck: () => 0,
                        credentials: getGitCredentials
                    }
                }
            });
        } catch (error: unknown) {
            const isAuthenticationIssue = (error as Error).message.includes('authentication');
            const responseMessage = isAuthenticationIssue
                ? 'GIT Authentication failed - Please note that some git providers require a token to be passed instead of a password'
                : 'The URL is not accessible';

            res.status(400).send({
                message: responseMessage
            });

            return;
        }

        directoryTree(
            repositoryPath,
            {
                extensions: /.tf$/,
                exclude: /.git/
            },
            (_file, filePath) => {
                const relativeFilePath = path.relative(repositoryPath, filePath);

                const isInRootDirectory = !relativeFilePath.includes('/');

                if (!isInRootDirectory) {
                    const fileDirectory = path.dirname(relativeFilePath);

                    if (!terraformModuleDirectories.includes(fileDirectory)) {
                        terraformModuleDirectories.push(fileDirectory);
                    }
                }
            }
        );

        fs.rmdirSync(repositoryPath, { recursive: true });

        if (terraformModuleDirectories.length) {
            res.send(terraformModuleDirectories.sort());
        } else {
            res.status(400).send({ message: "Couldn't find a Terraform module in the provided package" });
        }
    };

    try {
        if (isGitFile) {
            await scanGitFile();
        } else {
            await scanZipFile();
        }
    } catch (err: any) {
        logger.error(`Error while fetching ${isGitFile ? 'git' : 'zip'} file: ${err.message}`);
        if (err.response) {
            const statusCode = err.response.status >= 400 && err.response.status < 500 ? err.response.status : 400;
            res.status(statusCode).send({
                message: `The URL is not accessible - Error ${err.response.status} ${STATUS_CODES[err.response.status]}`
            });
        } else {
            res.status(400).send({
                message: 'The URL is not accessible'
            });
        }
    }
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
