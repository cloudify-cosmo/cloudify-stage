import type { FullDeploymentData } from '../../deployments/DeploymentActions';

export interface FetchedEnvironment {
    id: FullDeploymentData['id'];
    // eslint-disable-next-line
    display_name: FullDeploymentData['display_name'];
    capabilities: FullDeploymentData['capabilities'];
}

export interface Environment {
    id: FetchedEnvironment['id'];
    capabilities: FetchedEnvironment['capabilities'];
    displayName: FetchedEnvironment['display_name'];
}

export type FilteredEnvironments = {
    suggestedEnvironments: Environment[];
    notSuggestedEnvironments: Environment[];
};
