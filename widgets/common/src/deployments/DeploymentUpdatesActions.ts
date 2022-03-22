// @ts-nocheck File not migrated fully to TS
export default class DeploymentUpdatesActions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doGetUpdate(id) {
        return this.toolbox.getManager().doGet(`/deployment-updates/${id}`);
    }

    doGetExecutionParameters(id) {
        return this.toolbox.getManager().doGet(`/executions/${id}?_include=parameters`);
    }
}
