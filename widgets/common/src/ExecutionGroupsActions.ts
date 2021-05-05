export default class ExecutionGroupsActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doStart(workflowId: string, groupId: string, defaultParameters?: Record<string, any>) {
        return this.toolbox.getManager().doPost(`/execution-groups`, null, {
            workflow_id: workflowId,
            deployment_group_id: groupId,
            default_parameters: defaultParameters
        });
    }
}

declare global {
    namespace Stage.Common {
        export { ExecutionGroupsActions };
    }
}

Stage.defineCommon({
    name: 'ExecutionGroupsActions',
    common: ExecutionGroupsActions
});
