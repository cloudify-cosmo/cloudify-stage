import _, { escapeRegExp, trimEnd, merge, trimStart } from 'lodash';
import type { File } from 'decompress';
import decompress from 'decompress';
import ejs from 'ejs';
import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import os from 'os';
import path from 'path';
import axios from 'axios';
import { STATUS_CODES } from 'http';
import uniqueDirectoryName from 'short-uuid';
import directoryTree from 'directory-tree';
import simpleGit from 'simple-git';
import type { GitError } from 'simple-git';
import multer from 'multer';
import archiver from 'archiver';
// @ts-ignore-next-line typing doesn't exist for this library
import tfParser from '@evops/hcl-terraform-parser';

import { getLogger } from '../handler/LoggerHandler';
import type { RequestArchiveBody, RequestBody, RequestFetchDataBody } from './Terraform.types';
import checkIfFileUploaded from '../middleware/checkIfFileUploadedMiddleware';

const directoryTreeOptions = {
    extensions: /.tf$/,
    exclude: /.git/,
    name: 'main.tf'
};

const upload = multer({ limits: { fileSize: 1024 * 1024 } }); // 1024 Bytes * 1024 = 1 MB
const logger = getLogger('Terraform');
const router = express.Router();
const templatePath = path.resolve(__dirname, '../templates/terraform');
const template = fs.readFileSync(path.resolve(templatePath, 'blueprint.ejs'), 'utf8');
// NOTE: The idea behind the code below has been described in more details here: https://serverfault.com/questions/544156/git-clone-fail-instead-of-prompting-for-credentials
const disableGitAuthenticationPromptOption = '-c core.askPass=echo';

router.use(express.json());

type ResourcesRequest = Request<
    unknown,
    unknown,
    unknown,
    {
        templateUrl: string;
    }
>;

const throwExceptionIfModuleListEmpty = (modules: string[]) => {
    if (modules.length === 0) throw new Error("Couldn't find a Terraform module in the provided package");
    return modules;
};

const getBufferFromUrl = async (url: string, authHeader?: string) => {
    return axios(url, {
        responseType: 'arraybuffer',
        headers: authHeader ? { Authorization: authHeader } : {}
    }).then(response => response.data);
};

const getGitUrl = (url: string, authHeader?: string) => {
    if (authHeader) {
        const encodedCredentials = authHeader.replace(new RegExp('Basic ', 'ig'), '');
        const gitCredentials = Buffer.from(encodedCredentials, 'base64').toString('binary');
        const [username, personalToken] = gitCredentials.split(':');
        const credentialsString = `${username}:${personalToken}@`;
        return url.replace('//', `//${credentialsString}`);
    }

    return url;
};

const cloneGitRepo = async (repositoryPath: string, url: string, authHeader?: string): Promise<void> => {
    try {
        const gitUrl = getGitUrl(url, authHeader);
        await simpleGit().clone(gitUrl, repositoryPath, [disableGitAuthenticationPromptOption]);
        // @ts-ignore-next-line simple-git library ensures that the occurred error would be in a shape of the GitError type
    } catch (error: GitError) {
        const isAuthenticationIssue = error.message.includes('Authentication failed');
        const errorMessage = isAuthenticationIssue
            ? 'Git Authentication failed - Please note that some git providers require a token to be passed instead of a password'
            : 'The URL is not accessible';

        logger.error(`Error while cloning git repository: ${error.message}`);
        throw new Error(errorMessage);
    }
};

const getModuleListForZipBuffer = async (content: Buffer): Promise<string[]> =>
    decompress(content)
        .then((files: File[]) =>
            _(files)
                .filter({ type: 'directory' })
                .map('path')
                .filter(directory =>
                    files.some(
                        file => file.type === 'file' && file.path.match(`^${escapeRegExp(directory)}[^/]+\\.tf$`)
                    )
                )
                .map(directory => trimEnd(directory, '/'))
                .sort()
                .value()
        )
        .catch((decompressErr: any) => {
            logger.error(`Error while decompressing zip file:`, decompressErr);
            throw new Error('The URL does not point to a valid ZIP file');
        });

const getUniqNotExistingTemporaryDirectory = (): string => {
    const repositoryPath = path.join(os.tmpdir(), uniqueDirectoryName.generate());
    if (fs.existsSync(repositoryPath)) {
        return getUniqNotExistingTemporaryDirectory();
    }
    return repositoryPath;
};

const getModuleListForGitUrl = async (url: string, authHeader?: string) => {
    const repositoryPath = getUniqNotExistingTemporaryDirectory();
    const terraformModuleDirectories: string[] = [];

    await cloneGitRepo(repositoryPath, url, authHeader);

    directoryTree(repositoryPath, directoryTreeOptions, (_file, filePath) => {
        const relativeFilePath = path.relative(repositoryPath, filePath);
        const isInRootDirectory = !relativeFilePath.includes('/');

        if (isInRootDirectory) {
            return;
        }

        const fileDirectory = path.dirname(relativeFilePath);
        if (!terraformModuleDirectories.includes(fileDirectory)) {
            terraformModuleDirectories.push(fileDirectory);
        }
    });

    fs.rmdirSync(repositoryPath, { recursive: true });

    return terraformModuleDirectories.sort();
};

const getTfFileBufferListFromGitRepositoryUrl = async (url: string, resourceLocation: string, authHeader?: string) => {
    const repositoryPath = getUniqNotExistingTemporaryDirectory();
    const files: string[] = [];

    await cloneGitRepo(repositoryPath, url, authHeader);

    await directoryTree(repositoryPath, directoryTreeOptions, (_file, filePath) => {
        const isInRootDirectory = !filePath.includes('/');
        if (isInRootDirectory || filePath.indexOf(`${resourceLocation}/main.tf`) > -1) {
            return;
        }
        const mainPath = path.dirname(filePath);
        files.push(filePath);

        const outputsPath = path.join(mainPath, 'outputs.tf');
        if (fs.existsSync(outputsPath)) {
            files.push(outputsPath);
        }

        const variablesPath = path.join(mainPath, 'variables.tf');
        if (fs.existsSync(variablesPath)) {
            files.push(variablesPath);
        }
    });

    const fileBufferList = files.map(filePath => {
        return fs.readFileSync(filePath);
    });

    fs.rmdirSync(repositoryPath, { recursive: true });

    return fileBufferList;
};

const getModuleListForUrl = async (templateUrl: string, authHeader?: string) => {
    const isGitFile = templateUrl.endsWith('.git');
    return throwExceptionIfModuleListEmpty(
        isGitFile
            ? await getModuleListForGitUrl(templateUrl, authHeader)
            : await getModuleListForZipBuffer(await getBufferFromUrl(templateUrl, authHeader))
    );
};

const renderBlueprint = (
    {
        blueprintName,
        blueprintDescription,
        terraformVersion,
        terraformTemplate = '',
        urlAuthentication,
        resourceLocation,
        variables = [],
        environmentVariables = [],
        outputs = []
    }: RequestBody,
    res: Response
) => {
    let result = '';

    try {
        result = ejs.render(
            template,
            {
                blueprintName,
                blueprintDescription,
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
    } catch (err: any) {
        logger.error(err);
        res.status(500).send({ message: `Error when generating blueprint` });
    }

    return result;
};

export function fileDebase64(req: Request, res: Response, next: NextFunction) {
    if (req.body.file) {
        const clearedBase64File = req.body.file.replace(/^(.*);base64,/, '');
        req.body.file = Buffer.from(clearedBase64File, 'base64');
        next();
    } else {
        const errorMessage = 'No file uploaded.';
        logger.error(errorMessage);

        res.status(400).send({ message: errorMessage });
    }
}

function checkIfFileBuffer(req: Request, res: Response, next: NextFunction) {
    if (!(req.file && Buffer.isBuffer(req.file?.buffer))) {
        res.status(400).send({ message: 'The file you sent is not valid' });
    } else {
        next();
    }
}

/**
 * @description endpoint dedicated to list Terraform modules inside of uploaded zip archive
 * @returns string[] with terraform module list inside uploaded zip file
 */
router.post(
    '/resources/file',
    upload.single('file'),
    checkIfFileUploaded(logger),
    checkIfFileBuffer,
    async (req, res) => {
        try {
            // @ts-ignore: checkIfFileBuffer middleware function ensures us that req.file.buffer is not undefined
            res.send(await getModuleListForZipBuffer(req.file.buffer));
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    }
);

router.post('/resources', async (req: ResourcesRequest, res) => {
    const { templateUrl } = req.query;
    const authHeader = req.get('Authorization');

    try {
        res.send(await getModuleListForUrl(templateUrl, authHeader));
    } catch (err: any) {
        logger.error(`Error while fetching file: ${err.message}`);
        if (err.response) {
            const statusCode = err.response.status >= 400 && err.response.status < 500 ? err.response.status : 400;
            res.status(statusCode).send({
                message: `The URL is not accessible - Error ${err.response.status} ${STATUS_CODES[err.response.status]}`
            });
        } else {
            res.status(400).send({
                message: err.message
            });
        }
    }
});

async function getTerraformFileBufferListFromZip(zipBuffer: Buffer, resourceLocation: string) {
    const resourceLocationTrimmed = trimStart(resourceLocation, '/');
    const acceptableFilePaths = [
        `${resourceLocationTrimmed}/main.tf`,
        `${resourceLocationTrimmed}/outputs.tf`,
        `${resourceLocationTrimmed}/variables.tf`
    ];

    const files = await decompress(zipBuffer);
    return files.filter(file => acceptableFilePaths.includes(`${file.path}`)).map(file => file?.data);
}

function getTerraformJsonMergedFromFileBufferList(files: Buffer[]) {
    return files.reduce(
        (previousValue: any, terraformFile: Buffer) => merge(previousValue, tfParser.parse(terraformFile)),
        {}
    );
}

router.post('/fetch-data', async (req, res) => {
    const authHeader = req.get('Authorization');

    const { templateUrl, resourceLocation }: RequestFetchDataBody = req.body;
    const isGitFile = templateUrl.endsWith('.git');

    if (isGitFile) {
        const terraformFiles = await getTfFileBufferListFromGitRepositoryUrl(templateUrl, resourceLocation, authHeader);
        res.send(getTerraformJsonMergedFromFileBufferList(terraformFiles));
    } else {
        const zipBuffer = await getBufferFromUrl(templateUrl, authHeader);
        const terraformFiles = await getTerraformFileBufferListFromZip(zipBuffer, resourceLocation);
        res.send(getTerraformJsonMergedFromFileBufferList(terraformFiles));
    }
});

router.post('/fetch-data/file', fileDebase64, async (req, res) => {
    const { resourceLocation } = req.body;
    const terraformFiles = await getTerraformFileBufferListFromZip(req.body.file, resourceLocation);
    res.send(getTerraformJsonMergedFromFileBufferList(terraformFiles));
});

router.post('/blueprint', (req, res) => {
    const { terraformVersion, terraformTemplate, resourceLocation }: RequestBody = req.body;

    logger.debug(
        `Generating Terraform blueprint using: version=${terraformVersion}, template=${terraformTemplate}, location=${resourceLocation}.`
    );

    const result = renderBlueprint(req.body, res);

    res.setHeader('content-type', 'text/x-yaml');
    res.send(result);
});

router.post('/blueprint/archive', fileDebase64, (req, res) => {
    const terraformTemplate = path.join('tf_module', 'terraform.zip');
    const { terraformVersion, resourceLocation }: RequestArchiveBody = req.body;

    logger.debug(
        `Generating Terraform blueprint archive using: version=${terraformVersion}, template=${terraformTemplate}, location=${resourceLocation}.`
    );

    const result = renderBlueprint({ ...req.body, terraformTemplate }, res);

    const archive = archiver('zip');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=blueprint.zip');
    archive.pipe(res);

    archive.append(result, { name: 'blueprint/blueprint.yaml' });
    archive.append(req.body.file, { name: 'blueprint/tf_module/terraform.zip' });
    archive.finalize();
});

export default router;
