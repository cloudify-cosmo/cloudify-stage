export default class ExecutionGroupsActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doStart(groupId: string, workflowId: string, defaultParameters?: Record<string, any>) {
        return this.toolbox.getManager().doPost('/execution-groups', {
            body: {
                workflow_id: workflowId,
                deployment_group_id: groupId,
                default_parameters: defaultParameters
            }
        });
    }
}
