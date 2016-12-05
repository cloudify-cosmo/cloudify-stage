/**
 * Created by kinneretzin on 29/11/2016.
 */

export default class {
    constructor(context) {
        this.context = context;
    }

    doGetFullBlueprintData(blueprint) {
        return this.context.getManager().doGet(`/blueprints/${blueprint.id}`);
    }
    doDelete(blueprint) {
        return this.context.getManager().doDelete(`/blueprints/${blueprint.id}`);
    }

    doDeploy(blueprint,deploymentId,inputs) {
        return this.context.getManager().doPut(`/deployments/${deploymentId}`,null,{
            'blueprint_id': blueprint.id,
            inputs
        });
    }

    doUpload(blueprintName,blueprintFileName,file) {
        return this.context.getManager().doUpload(`/blueprints/${blueprintName}`,_.isEmpty(blueprintFileName) ? null : {
            application_file_name: blueprintFileName+'.yaml'
        },file);
    }
}