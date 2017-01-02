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

    doDeploy(blueprint,deploymentId,inputs) {
        return this.toolbox.getManager().doPut(`/deployments/${deploymentId}`,null,{
            'blueprint_id': blueprint.id,
            inputs
        });
    }

    doUpload(blueprintName,blueprintFileName,file) {
        return this.toolbox.getManager().doUpload(`/blueprints/${blueprintName}`,_.isEmpty(blueprintFileName) ? null : {
            application_file_name: blueprintFileName+'.yaml'
        },file);
    }
}