import type {
    PostTerraformBlueprintArchiveRequestBody,
    PostTerraformBlueprintRequestBody
} from '../../../../backend/routes/Terraform.types';

export default class TerraformActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGenerateBlueprint(body: PostTerraformBlueprintRequestBody) {
        return this.toolbox.getInternal().doPost('/terraform/blueprint', { body });
    }

    doGenerateBlueprintArchive(body: PostTerraformBlueprintArchiveRequestBody) {
        return this.toolbox.getInternal().doPost('/terraform/blueprint/archive', { body, parseResponse: false });
    }

    doGetTemplateModulesByUrl(templateUrl: string, username?: string, password?: string) {
        const headers = username ? { Authorization: `Basic ${btoa(`${username}:${password}`)}` } : undefined;
        return this.toolbox.getInternal().doPost('/terraform/resources', {
            params: { templateUrl },
            headers,
            validateAuthentication: false
        });
    }

    doGetTemplateModulesByFile(file: File) {
        return this.toolbox.getInternal().doUpload('/terraform/resources/file', {
            method: 'POST',
            files: {
                file
            }
        });
    }

    doGetOutputsAndVariablesByURL(templateUrl: string, resourceLocation: string, username?: string, password?: string) {
        const headers = username ? { Authorization: `Basic ${btoa(`${username}:${password}`)}` } : undefined;

        return this.toolbox.getInternal().doPost('/terraform/fetch-data', {
            body: {
                templateUrl,
                resourceLocation
            },
            headers
        });
    }

    doGetOutputsAndVariablesByFile(file: string, resourceLocation: string) {
        return this.toolbox.getInternal().doPost('/terraform/fetch-data/file', {
            body: {
                file,
                resourceLocation
            }
        });
    }
}
