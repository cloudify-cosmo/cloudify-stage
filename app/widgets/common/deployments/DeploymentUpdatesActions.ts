export default class DeploymentUpdatesActions {
    constructor(private toolbox: Stage.Types.WidgetlessToolbox) {
        this.toolbox = toolbox;
    }

    doGetUpdate(id: string) {
        return this.toolbox.getManager().doGet(`/deployment-updates/${id}`);
    }

    doGetExecutionParameters(id: string) {
        return this.toolbox.getManager().doGet(`/executions/${id}?_include=parameters`);
    }
}
