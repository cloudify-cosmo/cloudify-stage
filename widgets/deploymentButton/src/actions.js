/**
 * Created by kinneretzin on 29/11/2016.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetBlueprints() {
        return this.toolbox.getManager().doGet('/blueprints?_include=id');
    }

    doGetFullBlueprintData(blueprintId) {
        return this.toolbox.getManager().doGet(`/blueprints/${blueprintId}`);
    }

    doDeploy(blueprintId,deploymentId,inputs,privateResource=false, skipPluginsValidation=false) {
        return this.toolbox.getManager().doPut(`/deployments/${deploymentId}`,{private_resource: privateResource},{
            'blueprint_id': blueprintId,
            inputs,
            skip_plugins_validation:skipPluginsValidation
        });
    }
}