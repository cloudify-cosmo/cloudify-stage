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
import uniqueDirectoryName from 'short-uuid';
import directoryTree from 'directory-tree';
import simpleGit from 'simple-git';
import type { GitError } from 'simple-git';
import { getLogger } from '../handler/LoggerHandler';
import type { RequestBody } from './Terraform.types';

const logger = getLogger('Terraform');
const router = express.Router();
const templatePath = path.resolve(__dirname, '../templates/terraform');
const template = fs.readFileSync(path.resolve(templatePath, 'blueprint.ejs'), 'utf8');
// NOTE: The idea behind the code below has been described in more details here: https://serverfault.com/questions/544156/git-clone-fail-instead-of-prompting-for-credentials
const disableGitAuthenticationPromptOption = '-c core.askPass=echo';

router.use(bodyParser.json());

type CloneGitRepoError = {
    message: string;
};

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

    const sendTerraformModules = (modules: string[]) => {
        if (modules.length) res.send(modules);
        else res.status(400).send({ message: "Couldn't find a Terraform module in the provided package" });
    };

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

                    sendTerraformModules(modules);
                })
                .catch((decompressErr: any) => {
                    logger.error(`Error while decompressing zip file:`, decompressErr);
                    res.status(400).send({ message: 'The URL does not point to a valid ZIP file' });
                })
        );
    };

    const getGitUrl = () => {
        if (authHeader) {
            const encodedCredentials = authHeader.replace('Basic ', '');
            const gitCredentials = Buffer.from(encodedCredentials, 'base64').toString('binary');
            const [username, personalToken] = gitCredentials.split(':');
            const credentialsString = `${username}:${personalToken}@`;
            return templateUrl.replace('//', `//${credentialsString}`);
        }

        return templateUrl;
    };

    const cloneGitRepo = async (repositoryPath: string) => {
        try {
            const gitUrl = getGitUrl();
            await simpleGit().clone(gitUrl, repositoryPath, [disableGitAuthenticationPromptOption]);
            // @ts-ignore-next-line simple-git library ensures that the occured error would be in a shape of the GitError type
        } catch (error: GitError) {
            const isAuthenticationIssue = error.message.includes('Authentication failed');
            const errorMessage = isAuthenticationIssue
                ? 'Git Authentication failed - Please note that some git providers require a token to be passed instead of a password'
                : 'The URL is not accessible';

            logger.error(`Error while cloning git repository: ${error.message}`);
            throw new Error(errorMessage);
        }
    };

    const scanGitFile = async () => {
        const repositoryPath = path.join(os.tmpdir(), uniqueDirectoryName.generate());
        const terraformModuleDirectories: string[] = [];

        try {
            await cloneGitRepo(repositoryPath);
            // @ts-ignore-next-line cloneGitRepo function ensures the error shape
        } catch (error: CloneGitRepoError) {
            res.status(400).send({
                message: error.message
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
        sendTerraformModules(terraformModuleDirectories.sort());
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
