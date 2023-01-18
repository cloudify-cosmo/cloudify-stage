import StageUtils from '../../../../utils/stageUtils';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';
import type { Environment, FilteredEnvironments } from './EnvironmentDropdown.types';

export const formatDropdownItemText = (item: Environment) => {
    return StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name });
};

const simplifyCapabilities = (capabilities: BlueprintRequirements['parent_capabilities']): string[] => {
    return capabilities.map(innerCapabilities => innerCapabilities[0]);
};

const isEnvironmentSuggested = (deployment: Environment, simplifiedCapabilities: string[]): boolean => {
    const deploymentCapabilities = Object.keys(deployment.capabilities);
    const isSuggestedDeployment = simplifiedCapabilities.every(
        capability =>
            !!deploymentCapabilities.find(
                deploymentCapability => deploymentCapability.toUpperCase() === capability.toUpperCase()
            )
    );

    return isSuggestedDeployment;
};

export const filterEnvironments = (
    environments: Environment[],
    capabilities: BlueprintRequirements['parent_capabilities']
) => {
    const capabilitiesToMatch = simplifyCapabilities(capabilities);

    return environments.reduce<FilteredEnvironments>((filteredEnvironments, environment) => {
        const isSuggestedOption = isEnvironmentSuggested(environment, capabilitiesToMatch);

        if (isSuggestedOption) {
            filteredEnvironments.suggestedEnvironments.push(environment);
        } else {
            filteredEnvironments.nonSuggestedEnvironments.push(environment);
        }

        return filteredEnvironments;
    }, defaultEnvironmentList);
};
