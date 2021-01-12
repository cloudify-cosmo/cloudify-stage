/**
 * Created by kinneretzin on 29/11/2016.
 */

export default class BlueprintActions {
    static InProgressBlueprintStates = {
        Pending: 'Pending',
        Uploading: 'Uploading',
        Extracting: 'Extracting',
        Parsing: 'Parsing',
        UploadingImage: 'UploadingImage'
    };

    static CompletedBlueprintStates = {
        Uploaded: 'Uploaded',
        FailedUploading: 'FailedUploading',
        FailedExtracting: 'FailedExtracting',
        FailedParsing: 'FailedParsing',
        Invalid: 'Invalid'
    };

    static isUploaded(blueprint) {
        return blueprint.state === BlueprintActions.CompletedBlueprintStates.Uploaded;
    }

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doEditInComposer(blueprintId, mainFileName) {
        window.open(
            `/composer/import/${this.toolbox.getManager().getSelectedTenant()}/${blueprintId}/${mainFileName}`,
            '_blank'
        );
    }

    doGetBlueprints(params = null) {
        return this.toolbox.getManager().doGet('/blueprints?_include=id', params);
    }

    doGetFullBlueprintData(blueprint) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprint.id}`);
    }

    doDelete(blueprintId, force = false) {
        return this.toolbox
            .getManager()
            .doDelete(`/blueprints/${blueprintId}`, { force })
            .then(() => this.doDeleteImage(blueprintId));
    }

    doDeploy(
        blueprint,
        deploymentId,
        inputs,
        visibility,
        skipPluginsValidation = false,
        siteName = null,
        runtimeOnlyEvaluation = false
    ) {
        const data = {
            blueprint_id: blueprint.id,
            inputs,
            visibility,
            skip_plugins_validation: skipPluginsValidation,
            runtime_only_evaluation: runtimeOnlyEvaluation
        };

        if (siteName) {
            data.site_name = siteName;
        }

        return this.toolbox
            .getManager()
            .doPut(`/deployments/${deploymentId}`, null, data)
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
        blueprintName,
        blueprintYamlFile,
        blueprintUrl,
        file,
        imageUrl,
        image,
        visibility,
        onStateChanged = _.noop
    ) {
        const params = { visibility };

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
                .doUpload(`/blueprints/${blueprintName}`, params, file, undefined, undefined, compressFile);
        } else {
            promise = this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params);
        }

        return promise
            .then(() => this.waitUntilUploaded(blueprintName, onStateChanged))
            .then(() => onStateChanged(BlueprintActions.InProgressBlueprintStates.UploadingImage))
            .then(() => this.doUploadImage(blueprintName, imageUrl, image));
    }

    async waitUntilUploaded(blueprintName, onStateChanged, maxNumberOfRetries = 60, waitingInterval = 1000 /* ms */) {
        let previousState = BlueprintActions.InProgressBlueprintStates.Pending;
        for (let i = 0; i < maxNumberOfRetries; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await new Promise(resolve => {
                setTimeout(resolve, waitingInterval);
            });

            // eslint-disable-next-line no-await-in-loop
            const blueprint = await this.doGetFullBlueprintData({ id: blueprintName });

            if (BlueprintActions.isUploaded(blueprint)) {
                return;
            }

            if (BlueprintActions.CompletedBlueprintStates[blueprint.state]) {
                const error = Error(blueprint.error);
                error.state = blueprint.state;
                throw error;
            }

            if (blueprint.state !== previousState) {
                i = 0;
                onStateChanged(blueprint.state);
                previousState = blueprint.state;
            }
        }

        const timeout = Math.floor((maxNumberOfRetries * waitingInterval) / 1000);
        throw Error(`Timeout exceeded. Blueprint upload state not updated for ${timeout} seconds.`);
    }

    doSetVisibility(blueprintId, visibility) {
        return this.toolbox.getManager().doPatch(`/blueprints/${blueprintId}/set-visibility`, null, { visibility });
    }

    doListYamlFiles(blueprintUrl, file = null, includeFilename = false) {
        if (file) {
            return this.toolbox.getInternal().doUpload('/source/list/yaml', { includeFilename }, { archive: file });
        }
        return this.toolbox.getInternal().doPut('/source/list/yaml', { url: blueprintUrl, includeFilename });
    }

    doUploadImage(blueprintId, imageUrl, image) {
        if (_.isEmpty(imageUrl) && !image) {
            return Promise.resolve();
        }

        const params = { imageUrl };
        if (image) {
            return this.toolbox.getInternal().doUpload(`/ba/image/${blueprintId}`, params, image, 'post');
        }
        return this.toolbox.getInternal().doPost(`/ba/image/${blueprintId}`, params);
    }

    doDeleteImage(blueprintId) {
        return this.toolbox.getInternal().doDelete(`/ba/image/${blueprintId}`);
    }
}

Stage.defineCommon({
    name: 'BlueprintActions',
    common: BlueprintActions
});
