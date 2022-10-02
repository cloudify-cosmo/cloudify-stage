import type {
    PostTerraformBlueprintArchiveRequestBody,
    PostTerraformBlueprintRequestBody,
    PostTerraformBlueprintResponse,
    PostTerraformFetchDataFileResponse,
    PostTerraformFetchDataRequestBody,
    PostTerraformFetchDataResponse,
    PostTerraformResourcesFileResponse,
    PostTerraformResourcesQueryParams,
    PostTerraformResourcesResponse
} from '../../../../backend/routes/Terraform.types';

export default class TerraformActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGenerateBlueprint(body: PostTerraformBlueprintRequestBody) {
        return this.toolbox
            .getInternal()
            .doPost<PostTerraformBlueprintResponse, PostTerraformBlueprintRequestBody>('/terraform/blueprint', {
                body
            });
    }

    doGenerateBlueprintArchive(body: PostTerraformBlueprintArchiveRequestBody) {
        return this.toolbox
            .getInternal()
            .doPost<Response, PostTerraformBlueprintArchiveRequestBody>('/terraform/blueprint/archive', {
                body,
                parseResponse: false
            });
    }

    doGetTemplateModulesByUrl(templateUrl: string, username?: string, password?: string) {
        const headers = username ? { Authorization: `Basic ${btoa(`${username}:${password}`)}` } : undefined;
        return this.toolbox
            .getInternal()
            .doPost<PostTerraformResourcesResponse, never, PostTerraformResourcesQueryParams>('/terraform/resources', {
                params: { templateUrl },
                headers,
                validateAuthentication: false
            });
    }

    doGetTemplateModulesByFile(file: File) {
        return this.toolbox.getInternal().doUpload<PostTerraformResourcesFileResponse>('/terraform/resources/file', {
            method: 'POST',
            files: {
                file
            }
        });
    }

    doGetOutputsAndVariablesByURL(templateUrl: string, resourceLocation: string, username?: string, password?: string) {
        const headers = username ? { Authorization: `Basic ${btoa(`${username}:${password}`)}` } : undefined;

        return this.toolbox
            .getInternal()
            .doPost<PostTerraformFetchDataResponse, PostTerraformFetchDataRequestBody>('/terraform/fetch-data', {
                body: {
                    templateUrl,
                    resourceLocation
                },
                headers
            });
    }

    doGetOutputsAndVariablesByFile(file: string, resourceLocation: string) {
        return this.toolbox.getInternal().doPost<PostTerraformFetchDataFileResponse>('/terraform/fetch-data/file', {
            body: {
                file,
                resourceLocation
            }
        });
    }
}
