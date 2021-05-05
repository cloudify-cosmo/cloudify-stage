export default class DeploymentGroupsActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doCreate(id: string, filterId: string) {
        return this.toolbox.getManager().doPut(`/deployment-groups/${id}`, null, { filter_id: filterId });
    }
}

declare global {
    namespace Stage.Common {
        export { DeploymentGroupsActions };
    }
}

Stage.defineCommon({
    name: 'DeploymentGroupsActions',
    common: DeploymentGroupsActions
});
