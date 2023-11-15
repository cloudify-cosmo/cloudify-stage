import archiver from 'archiver';
import type { Response } from 'express';
import express from 'express';
import { STATUS_CODES } from 'http';
import multer from 'multer';
import path from 'path';

import { getLogger } from '../../handler/LoggerHandler';
import checkIfFileUploaded from '../../middleware/checkIfFileUploadedMiddleware';
import {
    checkIfFileBuffer,
    fileDebase64,
    getBufferFromUrl,
    getModuleListForUrl,
    getModuleListForZipBuffer,
    getTerraformFileBufferListFromZip,
    getTerraformJsonMergedFromFileBufferList,
    getTfFileBufferListFromGitRepositoryUrl,
    renderTerraformBlueprint
} from '../../handler/TerraformHandler';
import type {
    PostTerraformBlueprintArchiveRequestBody,
    PostTerraformBlueprintArchiveResponse,
    PostTerraformBlueprintRequestBody,
    PostTerraformBlueprintResponse,
    PostTerraformFetchDataFileRequestBody,
    PostTerraformFetchDataFileResponse,
    PostTerraformFetchDataRequestBody,
    PostTerraformFetchDataResponse,
    PostTerraformResourcesFileResponse,
    PostTerraformResourcesQueryParams,
    PostTerraformResourcesResponse
} from './Terraform.types';
import type { GenericErrorResponse } from '../../types';

const upload = multer({ limits: { fileSize: 1024 * 1024 } }); // 1024 Bytes * 1024 = 1 MB
const logger = getLogger('Terraform');
const router = express.Router();

router.use(express.json());

router.post<never, PostTerraformResourcesResponse | GenericErrorResponse, any, PostTerraformResourcesQueryParams>(
    '/resources',
    async (req, res) => {
        const { templateUrl } = req.query;
        const authHeader = req.get('Authorization');

        try {
            res.send(await getModuleListForUrl(templateUrl, authHeader));
        } catch (err: any) {
            logger.error(`Error while fetching file: ${err.message}`);
            if (err.response) {
                const statusCode = err.response.status >= 400 && err.response.status < 500 ? err.response.status : 400;
                res.status(statusCode).send({
                    message: `The URL is not accessible - Error ${err.response.status} ${
                        STATUS_CODES[err.response.status]
                    }`
                });
            } else {
                res.status(400).send({
                    message: err.message
                });
            }
        }
    }
);

/**
 * @description endpoint dedicated to list Terraform modules inside of uploaded zip archive
 * @returns string[] with terraform module list inside uploaded zip file
 */
router.post(
    '/resources/file',
    upload.single('file'),
    checkIfFileUploaded(logger),
    checkIfFileBuffer,
    async (req, res: Response<PostTerraformResourcesFileResponse | GenericErrorResponse>) => {
        try {
            res.send(await getModuleListForZipBuffer(req.file!.buffer));
        } catch (e: any) {
            res.status(400).send({ message: e.message });
        }
    }
);

router.post<never, PostTerraformFetchDataResponse, PostTerraformFetchDataRequestBody>(
    '/fetch-data',
    async (req, res) => {
        const authHeader = req.get('Authorization');

        const { templateUrl, resourceLocation } = req.body;
        const isGitFile = templateUrl.endsWith('.git');

        if (isGitFile) {
            const terraformFiles = await getTfFileBufferListFromGitRepositoryUrl(
                templateUrl,
                resourceLocation,
                authHeader
            );
            res.send(getTerraformJsonMergedFromFileBufferList(terraformFiles));
        } else {
            const zipBuffer = await getBufferFromUrl(templateUrl, authHeader);
            const terraformFiles = await getTerraformFileBufferListFromZip(zipBuffer, resourceLocation);
            res.send(getTerraformJsonMergedFromFileBufferList(terraformFiles));
        }
    }
);

router.post<never, PostTerraformFetchDataFileResponse | GenericErrorResponse, PostTerraformFetchDataFileRequestBody>(
    '/fetch-data/file',
    fileDebase64,
    async (req, res) => {
        const { resourceLocation } = req.body;
        const terraformFiles = await getTerraformFileBufferListFromZip(req.body.file, resourceLocation);
        res.send(getTerraformJsonMergedFromFileBufferList(terraformFiles));
    }
);

router.post<never, PostTerraformBlueprintResponse, PostTerraformBlueprintRequestBody>('/blueprint', (req, res) => {
    const { terraformVersion, terraformTemplate, resourceLocation } = req.body;

    logger.debug(
        `Generating Terraform blueprint using: version=${terraformVersion}, template=${terraformTemplate}, location=${resourceLocation}.`
    );

    const result = renderTerraformBlueprint(req.body, res);

    res.setHeader('content-type', 'text/x-yaml');
    res.send(result);
});

router.post<
    never,
    PostTerraformBlueprintArchiveResponse | GenericErrorResponse,
    PostTerraformBlueprintArchiveRequestBody
>('/blueprint/archive', fileDebase64, (req, res, next) => {
    const terraformTemplate = path.join('tf_module', 'terraform.zip');
    const { terraformVersion, resourceLocation } = req.body;

    logger.debug(
        `Generating Terraform blueprint archive using: version=${terraformVersion}, template=${terraformTemplate}, location=${resourceLocation}.`
    );

    const result = renderTerraformBlueprint({ ...req.body, terraformTemplate }, res);

    const archive = archiver('zip');

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename=blueprint.zip');
    archive.pipe(res);

    archive.append(result, { name: 'blueprint/blueprint.yaml' });
    archive.append(req.body.file!, { name: 'blueprint/tf_module/terraform.zip' });
    archive.finalize().catch(next);
});

export default router;
