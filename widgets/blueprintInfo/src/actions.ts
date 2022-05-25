// @ts-nocheck File not migrated fully to TS

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetBlueprintId(deploymentId) {
        return this.toolbox.getManager().doGet(`/deployments/${deploymentId}?_include=id,blueprint_id`);
    }

    doGetBlueprintDetails(blueprintId) {
        return this.toolbox
            .getManager()
            .doGet(
                `/blueprints/${blueprintId}?_include=id,updated_at,created_at,description,created_by,visibility,main_file_name,state`
            );
    }

    doGetBlueprintDeployments(blueprintId) {
        return new Stage.Common.Actions.Summary(this.toolbox).doGetDeployments('blueprint_id', {
            blueprint_id: blueprintId
        });
    }
}
