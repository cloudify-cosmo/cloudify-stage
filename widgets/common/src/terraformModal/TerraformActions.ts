import type { RequestArchiveBody, RequestBody } from '../../../../backend/routes/Terraform.types';

export default class TerraformActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGenerateBlueprint(body: RequestBody) {
        return this.toolbox.getInternal().doPost('/terraform/blueprint', { body });
    }

    doGenerateBlueprintArchive(body: RequestArchiveBody) {
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
}
