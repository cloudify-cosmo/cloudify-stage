import { FilterRule } from './filters/types';

type CreateDeploymentGroupData = {
    // eslint-disable-next-line camelcase
    filter_id?: string;
    // eslint-disable-next-line camelcase
    filter_rules?: FilterRule[];
    // eslint-disable-next-line camelcase
    deployment_ids?: string[];
    // eslint-disable-next-line camelcase
    deployments_from_group?: string;
};

export default class DeploymentGroupsActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doCreate(id: string, data: CreateDeploymentGroupData) {
        return this.toolbox.getManager().doPut(`/deployment-groups/${id}`, null, data);
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
