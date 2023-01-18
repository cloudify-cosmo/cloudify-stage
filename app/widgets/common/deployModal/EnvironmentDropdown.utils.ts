import StageUtils from '../../../utils/stageUtils';
import type { BlueprintRequirements } from '../blueprints/BlueprintActions';
import type { FetchedDeployment } from './EnvironmentDropdown';

export const formatDropdownItemText = (item: FetchedDeployment) => {
    return StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name });
};

export const simplifyCapabilities = (capabilities: BlueprintRequirements['parent_capabilities']): string[] => {
    return capabilities.map(innerCapabilities => innerCapabilities[0]);
};

export const isDeploymentSuggested = (deployment: FetchedDeployment, simplifiedCapabilities: string[]): boolean => {
    const deploymentCapabilities = Object.keys(deployment.capabilities);
    const isSuggestedDeployment = simplifiedCapabilities.every(
        capability =>
            !!deploymentCapabilities.find(
                deploymentCapability => deploymentCapability.toUpperCase() === capability.toUpperCase()
            )
    );

    return isSuggestedDeployment;
};
