/**
 * Created by kinneretzin on 29/11/2016.
 */

class BlueprintActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
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

    doUpload(blueprintName, blueprintFileName, blueprintUrl, file, imageUrl, image, visibility) {
        const params = { visibility };

        if (!_.isEmpty(blueprintFileName)) {
            params.application_file_name = blueprintFileName;
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

        return promise.then(() => this.doUploadImage(blueprintName, imageUrl, image));
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
