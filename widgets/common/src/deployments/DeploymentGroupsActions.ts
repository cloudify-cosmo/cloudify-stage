import type { FilterRule } from '../filters/types';

type NewDeploymentsData = {
    id: string;
    labels: Record<string, string>[];
};

/* eslint-disable camelcase */
interface CreateDeploymentGroupData {
    filter_id?: string;
    filter_rules?: FilterRule[];
    deployment_ids?: string[];
    deployments_from_group?: string;
}

interface CreateNewDeploymentsData {
    new_deployments: NewDeploymentsData[];

    blueprint_id?: string;
    default_inputs?: Record<string, any>;
    visibility?: string;
    labels?: Record<string, string>[];
}
/* eslint-enable camelcase */

export default class DeploymentGroupsActions {
    constructor(private toolbox: Stage.Types.Toolbox) {}

    doCreate(id: string, body: CreateDeploymentGroupData | CreateNewDeploymentsData) {
        return this.toolbox.getManager().doPut(`/deployment-groups/${id}`, { body });
    }
}
