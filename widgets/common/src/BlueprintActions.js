/**
 * Created by kinneretzin on 29/11/2016.
 */

class BlueprintActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetFullBlueprintData(blueprint) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprint.id}`);
    }

    doDelete(blueprint) {
        return this.toolbox.getManager().doDelete(`/blueprints/${blueprint.id}`)
            .then(()=>this.doDeleteImage(blueprint.id));
    }

    doDeploy(blueprint, deploymentId, inputs) {
        return this.toolbox.getManager().doPut(`/deployments/${deploymentId}`,null,{
            'blueprint_id': blueprint.id,
            inputs
        });
    }

    doUpload(blueprintName, blueprintFileName, blueprintUrl, file, imageUrl, image) {
        var params = {};
        const YAML_EXTENSION = '.yaml';

        if (!_.isEmpty(blueprintFileName)) {
            params['application_file_name'] = _.endsWith(blueprintFileName, YAML_EXTENSION)
                                              ? blueprintFileName
                                              : blueprintFileName + YAML_EXTENSION;
        }
        if (!_.isEmpty(blueprintUrl)) {
            params['blueprint_archive_url'] = blueprintUrl;
        }

        var promise;
        if (file) {
            promise = this.toolbox.getManager().doUpload(`/blueprints/${blueprintName}`, params, file);
        } else {
            promise = this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params);
        }

        return promise.then(()=> this.doUploadImage(blueprintName, imageUrl, image));
    }

    doUploadImage(blueprintId, imageUrl, image) {
        if (_.isEmpty(imageUrl) && !image) {
            return Promise.resolve();
        }

        var params = {imageUrl};
        if (image) {
            return this.toolbox.getExternal().doUpload(`/ba/image/${blueprintId}`, params, image, "post");
        } else {
            return this.toolbox.getExternal().doPost(`/ba/image/${blueprintId}`, params);
        }
    }

    doDeleteImage(blueprintId) {
        return this.toolbox.getExternal().doDelete(`/ba/image/${blueprintId}`);
    }

}

Stage.defineCommon({
    name: 'BlueprintActions',
    common: BlueprintActions
});