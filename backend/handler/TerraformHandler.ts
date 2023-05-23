// @ts-ignore-next-line typing doesn't exist for this library
import tfParser from '@evops/hcl-terraform-parser';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import directoryTree from 'directory-tree';
import _, { escapeRegExp, merge, trimStart } from 'lodash';
import type { NextFunction, Request, Response } from 'express';
import type { Blueprint } from 'cloudify-ui-common-backend';
import { cloneGitRepo, renderBlueprintYaml } from 'cloudify-ui-common-backend';
import * as ArchiveHelper from './ArchiveHelper';
import { getLogger } from './LoggerHandler';
import type { TerraformBlueprintData, TerraformParserResult, Variable } from './TerraformHandler.types';
import { createGetAttributeCall, createGetSecretCall, createIntrinsicFunctionCall } from './services/BlueprintBuilder';

const logger = getLogger('Terraform');

const directoryTreeOptions: directoryTree.DirectoryTreeOptions = {
    extensions: /.tf$/,
    exclude: /.git/
};

export const isTerraformFilePath = (filePath: string, directoryPath: string): boolean => {
    return !!filePath.match(`^(${escapeRegExp(directoryPath)})[/]?[^/]+\\.tf$`);
};

const throwExceptionIfModuleListEmpty = (modules: string[]) => {
    if (modules.length === 0) throw new Error("Couldn't find a Terraform module in the provided package");
    return modules;
};

export const getBufferFromUrl = async (url: string, authHeader?: string) => {
    return axios(url, {
        responseType: 'arraybuffer',
        headers: authHeader ? { Authorization: authHeader } : {}
    }).then(response => response.data);
};

export const getModuleListForZipBuffer = async (content: Buffer): Promise<string[]> =>
    ArchiveHelper.decompressArchive(content)
        .then(entries =>
            _(entries)
                .filter(entry => !entry.isDirectory && entry.entryName.endsWith('.tf'))
                .map(file => path.dirname(file.entryName))
                .uniq()
                .sort()
                .value()
        )
        .catch((decompressErr: any) => {
            logger.error(`Error while decompressing zip file:`, decompressErr);
            throw new Error('The URL does not point to a valid ZIP file');
        });

const getModuleListForGitUrl = async (url: string, authHeader?: string) => {
    const terraformModuleDirectories: string[] = [];

    await cloneGitRepo(
        url,
        repositoryPath =>
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
            }),
        authHeader
    );

    return terraformModuleDirectories.sort();
};

export const getTfFileBufferListFromGitRepositoryUrl = async (
    url: string,
    resourceLocation: string,
    authHeader?: string
) => {
    const files: Buffer[] = [];

    await cloneGitRepo(
        url,
        async repositoryPath => {
            const terraformModulePath = path.join(repositoryPath, resourceLocation);
            await directoryTree(terraformModulePath, directoryTreeOptions, (_terraformFile, terraformFilePath) => {
                const fileBuffer = fs.readFileSync(terraformFilePath);
                files.push(fileBuffer);
            });
        },
        authHeader
    );

    return files;
};

export const getModuleListForUrl = async (templateUrl: string, authHeader?: string) => {
    const isGitFile = templateUrl.endsWith('.git');
    return throwExceptionIfModuleListEmpty(
        isGitFile
            ? await getModuleListForGitUrl(templateUrl, authHeader)
            : await getModuleListForZipBuffer(await getBufferFromUrl(templateUrl, authHeader))
    );
};

export const renderTerraformBlueprint = (terraformBlueprintData: TerraformBlueprintData, res: Response) => {
    function createVariables(variables?: Variable[]) {
        if (!variables?.length) {
            return undefined;
        }

        return variables
            .map(variable => ({
                [variable.variable]:
                    variable.source === 'static'
                        ? variable.value
                        : createIntrinsicFunctionCall(`get_${variable.source}`, variable.name)
            }))
            .reduce(merge, {});
    }

    function createOutputs(type: 'output' | 'capability') {
        return outputs
            ?.filter(output => output.type === type)
            .map(output => ({
                [output.name]: {
                    value: createGetAttributeCall('cloud_resources', 'outputs', output.terraformOutput, 'value')
                }
            }))
            .reduce(merge, {});
    }

    const {
        blueprintDescription,
        blueprintName,
        environmentVariables,
        outputs,
        resourceLocation,
        terraformTemplate,
        terraformVersion,
        urlAuthentication,
        variables
    } = terraformBlueprintData;

    const blueprintModel: Blueprint = {
        tosca_definitions_version: 'cloudify_dsl_1_4',
        description: blueprintDescription || '',
        imports: ['cloudify/types/types.yaml', 'plugin:cloudify-terraform-plugin'],
        inputs: (variables ?? [])
            .concat(environmentVariables ?? [])
            .filter(variable => variable.source === 'input' && !variable.duplicated)
            .map(variable => ({ [variable.name]: { type: 'string', default: variable.value || undefined } }))
            .reduce(merge, {}),
        node_templates: {
            terraform: {
                type: 'cloudify.nodes.terraform',
                properties: {
                    resource_config: {
                        installation_source: `https://releases.hashicorp.com/terraform/${terraformVersion}/terraform_${terraformVersion}_linux_amd64.zip`
                    }
                }
            },
            cloud_resources: {
                type: 'cloudify.nodes.terraform.Module',
                properties: {
                    resource_config: {
                        source: {
                            location: terraformTemplate,
                            username: urlAuthentication ? createGetSecretCall(`${blueprintName}.username`) : undefined,
                            password: urlAuthentication ? createGetSecretCall(`${blueprintName}.password`) : undefined
                        },
                        source_path: resourceLocation,
                        variables: createVariables(variables),
                        environment_variables: createVariables(environmentVariables)
                    }
                },
                relationships: [
                    {
                        target: 'terraform',
                        type: 'cloudify.terraform.relationships.run_on_host'
                    }
                ]
            }
        },
        outputs: createOutputs('output'),
        capabilities: createOutputs('capability')
    };

    let result = '';

    try {
        result = renderBlueprintYaml(blueprintModel);
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

export function checkIfFileBuffer(req: Request, res: Response, next: NextFunction) {
    if (!(req.file && Buffer.isBuffer(req.file?.buffer))) {
        res.status(400).send({ message: 'The file you sent is not valid' });
    } else {
        next();
    }
}

export async function getTerraformFileBufferListFromZip(zipBuffer: Buffer, resourceLocation: string) {
    const resourceLocationTrimmed = trimStart(resourceLocation, '/');

    const entries = await ArchiveHelper.decompressArchive(zipBuffer);
    return (
        entries
            .filter(entry => !entry.isDirectory && isTerraformFilePath(entry.entryName, resourceLocationTrimmed))
            // TODO Norbert: Investigate on adjusting that function as it's synchronous
            .map(file => file.getData())
    );
}

export function getTerraformJsonMergedFromFileBufferList(files: Buffer[]): TerraformParserResult {
    return files.reduce(
        (previousValue: any, terraformFile: Buffer) => merge(previousValue, tfParser.parse(terraformFile)),
        {}
    );
}
