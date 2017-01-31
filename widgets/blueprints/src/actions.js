/**
 * Created by kinneretzin on 29/11/2016.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetFullBlueprintData(blueprint) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprint.id}`);
    }
    doDelete(blueprint) {
        return this.toolbox.getManager().doDelete(`/blueprints/${blueprint.id}`);
    }

    doDeploy(blueprint, deploymentId, inputs) {
        return this.toolbox.getManager().doPut(`/deployments/${deploymentId}`,null,{
            'blueprint_id': blueprint.id,
            inputs
        });
    }

    doUpload(blueprintName, blueprintFileName, blueprintUrl, file) {
        var params = {};

        if (!_.isEmpty(blueprintFileName)) {
            params['application_file_name'] = blueprintFileName + ".yaml";
        }
        if (!_.isEmpty(blueprintUrl)) {
            params['blueprint_archive_url'] = blueprintUrl;
        }

        if (file) {
            return this.toolbox.getManager().doUpload(`/blueprints/${blueprintName}`, params, file);
        } else {
            return this.toolbox.getManager().doPut(`/blueprints/${blueprintName}`, params);
        }

    }
}