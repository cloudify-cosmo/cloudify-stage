import type { BlueprintUploadParameters } from './BlueprintActions';

const UploadBlueprintFormDataProperties = {
    Params: 'params',
    BlueprintArchive: 'blueprint_archive'
};

const generateUploadFormData = (params: BlueprintUploadParameters, blueprintFile?: File | Blob): FormData => {
    const formData = new FormData();
    formData.append(UploadBlueprintFormDataProperties.Params, JSON.stringify(params));

    if (blueprintFile) {
        formData.append(UploadBlueprintFormDataProperties.BlueprintArchive, blueprintFile);
    }

    return formData;
};

export default generateUploadFormData;
