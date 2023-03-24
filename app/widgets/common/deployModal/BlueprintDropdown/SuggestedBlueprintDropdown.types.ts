import type { FullDeploymentData } from '../../deployments/DeploymentActions';
import type { FullBlueprintData } from '../../blueprints/BlueprintActions';

export type FetchedBlueprint = Pick<FullBlueprintData, 'id' | 'requirements'>;

export type FilteredBlueprints = {
    suggestedBlueprints: FetchedBlueprint[];
    notSuggestedBlueprints: FetchedBlueprint[];
};

export type EnvironmentCapabilities = FullDeploymentData['capabilities'];
