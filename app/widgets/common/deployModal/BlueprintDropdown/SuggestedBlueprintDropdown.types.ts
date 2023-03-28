import type { FullDeploymentData } from '../../deployments/DeploymentActions';
import type { FullBlueprintData } from '../../blueprints/BlueprintActions';
import type { fetchedBlueprintFields } from './SuggestedBlueprintDropdown.consts';

export type FetchedBlueprint = Pick<FullBlueprintData, typeof fetchedBlueprintFields[number]>;

export type FilteredBlueprints = {
    suggestedBlueprints: FetchedBlueprint[];
    notSuggestedBlueprints: FetchedBlueprint[];
};

export type EnvironmentCapabilities = FullDeploymentData['capabilities'];
