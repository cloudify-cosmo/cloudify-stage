// eslint-disable-next-line max-classes-per-file

class BlueprintUploadError extends Error {
    constructor(message: string, public state: string) {
        super(message);
    }
}

export interface BlueprintDeployParams {
    blueprintId: string;
    deploymentId: string;
    deploymentName: string;
    inputs: Record<string, any>;
    visibility: string;
    labels: Stage.Common.Labels.Label[];
    skipPluginsValidation?: boolean;
    siteName?: string;
    runtimeOnlyEvaluation?: boolean;
}

export default class BlueprintActions {
    static InProgressBlueprintStates = {
        Pending: 'pending',
        Uploading: 'uploading',
        Extracting: 'extracting',
        Parsing: 'parsing',
        UploadingImage: 'uploading_image'
    };

    static CompletedBlueprintStates = {
        Uploaded: 'uploaded',
        FailedUploading: 'failed_uploading',
        FailedExtracting: 'failed_extracting',
        FailedParsing: 'failed_parsing',
        Invalid: 'invalid'
    };

    static isUploaded(blueprint: { state: string }) {
        return blueprint.state === BlueprintActions.CompletedBlueprintStates.Uploaded;
    }

    static isCompleted(blueprint: { state: string }) {
        return Object.values(BlueprintActions.CompletedBlueprintStates).includes(blueprint.state);
    }

    constructor(private toolbox: Stage.Types.Toolbox) {}

    doEditInComposer(blueprintId: string, mainFileName: string) {
        window.open(
            `/composer/import/${this.toolbox.getManager().getSelectedTenant()}/${blueprintId}/${mainFileName}`,
            '_blank'
        );
    }

    doGetBlueprints(params: Record<string, any>) {
        return this.toolbox.getManager().doGet('/blueprints?_include=id', { params });
    }

    doGetUploadedBlueprints(params?: Record<string, any>) {
        return this.toolbox
            .getManager()
            .doGet('/blueprints?_include=id,state', { params })
            .then(response =>
                response.items.filter((blueprint: { state: string }) => BlueprintActions.isUploaded(blueprint))
            );
    }

    doGetFullBlueprintData(blueprintId: string) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprintId}`);
    }

    doDelete(blueprintId: string, force = false) {
        return this.toolbox
            .getManager()
            .doDelete(`/blueprints/${blueprintId}`, { params: { force } })
            .then(() => this.doDeleteImage(blueprintId));
    }

    doDeploy({
        blueprintId,
        deploymentId,
        deploymentName,
        inputs,
        visibility,
        labels = [],
        skipPluginsValidation = false,
        siteName,
        runtimeOnlyEvaluation = false
    }: BlueprintDeployParams) {
        const { DeploymentActions } = Stage.Common;
        const body: Record<string, any> = {
            blueprint_id: blueprintId,
            display_name: deploymentName,
            inputs,
            visibility,
            labels: DeploymentActions.toManagerLabels(labels),
            skip_plugins_validation: skipPluginsValidation,
            runtime_only_evaluation: runtimeOnlyEvaluation
        };

        if (siteName) {
            body.site_name = siteName;
        }

        return this.toolbox
            .getManager()
            .doPut(`/deployments/${deploymentId}`, { body })
            .catch(err =>
                Promise.reject(
                    err.code === 'deployment_plugin_not_found'
                        ? {
                              ...err,
                              message: `${err.message}. Install the plugin or use "Skip plugins validation" option.`
                          }
                        : err
                )
            );
    }

    doUpload(
        blueprintName: string,
        blueprintYamlFile: string,
        blueprintUrl: string,
        file: any,
        imageUrl: string,
        image: any,
        visibility: string,
        onStateChanged = _.noop
    ) {
        const params: Record<string, any> = { visibility, async_upload: true };

        if (!_.isEmpty(blueprintYamlFile)) {
            params.application_file_name = blueprintYamlFile;
        }
        if (!_.isEmpty(blueprintUrl)) {
            params.blueprint_archive_url = blueprintUrl;
        }

        let promise;
        if (file) {
            const compressFile = _.endsWith(file.name, '.yaml') || _.endsWith(file.name, '.yml');
            promise = this.toolbox
                .getManager()
                .doUpload(`/blueprints/${blueprintName}`, { params, files: file, parseResponse: false, compressFile });
        } else {
            promise = this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, { params });
        }

        return promise
            .then(() => this.waitUntilUploaded(blueprintName, onStateChanged))
            .then(() => onStateChanged(BlueprintActions.InProgressBlueprintStates.UploadingImage))
            .then(() => this.doUploadImage(blueprintName, imageUrl, image));
    }

    async waitUntilUploaded(blueprintName: string, onStateChanged: (state: string) => void) {
        const { PollHelper } = Stage.Common;
        const pollHelper = new PollHelper(60);

        let previousState = BlueprintActions.InProgressBlueprintStates.Pending;
        for (;;) {
            // eslint-disable-next-line no-await-in-loop
            await pollHelper.wait();

            // eslint-disable-next-line no-await-in-loop
            const blueprint = await this.doGetFullBlueprintData(blueprintName);

            if (BlueprintActions.isUploaded(blueprint)) {
                return;
            }

            if (BlueprintActions.isCompleted(blueprint)) {
                throw new BlueprintUploadError(blueprint.error, blueprint.state);
            }

            if (blueprint.state !== previousState) {
                pollHelper.resetAttempts();
                onStateChanged(blueprint.state);
                previousState = blueprint.state;
            }
        }
    }

    doSetVisibility(blueprintId: string, visibility: string) {
        return this.toolbox.getManager().doPatch(`/blueprints/${blueprintId}/set-visibility`, { body: { visibility } });
    }

    doListYamlFiles(blueprintUrl: string, file = null, includeFilename = false) {
        if (file) {
            return this.toolbox
                .getInternal()
                .doUpload('/source/list/yaml', { params: { includeFilename }, files: { archive: file } });
        }
        return this.toolbox
            .getInternal()
            .doPut('/source/list/yaml', { params: { url: blueprintUrl, includeFilename } });
    }

    doUploadImage(blueprintId: string, imageUrl: string, files: any) {
        if (_.isEmpty(imageUrl) && !files) {
            return Promise.resolve();
        }

        const params = { imageUrl };
        if (files) {
            return this.toolbox.getInternal().doUpload(`/ba/image/${blueprintId}`, { params, files, method: 'post' });
        }
        return this.toolbox.getInternal().doPost(`/ba/image/${blueprintId}`, { params });
    }

    doDeleteImage(blueprintId: string) {
        return this.toolbox.getInternal().doDelete(`/ba/image/${blueprintId}`);
    }
}

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export { BlueprintActions };
    }
}

Stage.defineCommon({
    name: 'BlueprintActions',
    common: BlueprintActions
});
