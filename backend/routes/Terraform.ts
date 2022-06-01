import _, { escapeRegExp, trimEnd } from 'lodash';
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
import { getLogger } from '../handler/LoggerHandler';
import type { RequestArchiveBody, RequestBody } from './Terraform.types';
import checkIfFileUploaded from '../middleware/checkIfFileUploadedMiddleware';

const upload = multer({ limits: { fileSize: 1048576 } }); // 1048576 bytes ~ 1 megabyte
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

const scanZipFile = async (content: Buffer): Promise<string[]> =>
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

const scanGitFile = async (url: string, authHeaderValue?: string) => {
    const repositoryPath = getUniqNotExistingTemporaryDirectory();
    const terraformModuleDirectories: string[] = [];

    await cloneGitRepo(repositoryPath, url, authHeaderValue);

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

    return terraformModuleDirectories.sort();
};

const getModuleListForUrl = async (templateUrl: string, authHeader?: string) => {
    const isGitFile = templateUrl.endsWith('.git');
    return throwExceptionIfModuleListEmpty(
        isGitFile
            ? await scanGitFile(templateUrl, authHeader)
            : await scanZipFile(await getBufferFromUrl(templateUrl, authHeader))
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

/**
 * @description endpoint dedicated to list Terraform modules inside of uploaded zip archive
 * @returns string[] with terraform module list inside uploaded zip file
 */
router.post('/resources/file', upload.single('file'), checkIfFileUploaded(logger), async (req, res) => {
    if (req.file && Buffer.isBuffer(req.file?.buffer)) {
        try {
            res.send(await scanZipFile(req.file.buffer));
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    } else {
        res.status(400).send({ message: 'The file you sent is not valid' });
    }
});

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

    if (!(req.body.file && Buffer.isBuffer(req.body.file))) {
        res.status(400).send({ message: 'No file uploaded.' });
    } else {
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
    }
});

export default router;
