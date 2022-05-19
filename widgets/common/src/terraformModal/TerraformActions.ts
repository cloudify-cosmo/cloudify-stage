import type { RequestArchiveBody, RequestBody } from '../../../../backend/routes/Terraform.types';

// source: https://stackoverflow.com/questions/16104078/appending-array-to-formdata-and-send-via-ajax
function convertObjectToFormData(val: any, formData = new FormData(), namespace = '') {
    if (typeof val !== 'undefined' && val !== null) {
        if (val instanceof Date) {
            formData.append(namespace, val.toISOString());
        } else if (val instanceof Array) {
            for (let i = 0; i < val.length; i++) {
                convertObjectToFormData(val[i], formData, `${namespace}[${i}]`);
            }
        } else if (typeof val === 'object' && !(val instanceof File)) {
            for (const propertyName in val) {
                if (val.hasOwnProperty(propertyName)) {
                    convertObjectToFormData(
                        val[propertyName],
                        formData,
                        namespace ? `${namespace}[${propertyName}]` : propertyName
                    );
                }
            }
        } else if (val instanceof File) {
            formData.append(namespace, val);
        } else {
            formData.append(namespace, val.toString());
        }
    }
    return formData;
}

export default class TerraformActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {}

    doGenerateBlueprint(body: RequestBody) {
        return this.toolbox.getInternal().doPost('/terraform/blueprint', { body });
    }

    doGenerateBlueprintArchive(bodyObject: RequestArchiveBody) {
        const body = convertObjectToFormData(bodyObject);
        return this.toolbox.getInternal().doPost('/terraform/blueprint/archive', {
            body,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
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
