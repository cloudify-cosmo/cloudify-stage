import type { DropdownItemProps } from 'semantic-ui-react';
import StageUtils from '../../../utils/stageUtils';
import type { BlueprintRequirements } from '../blueprints/BlueprintActions';
import type { FetchedDeployment } from './EnvironmentDropdown';

const formatDropdownItemText = (item: FetchedDeployment) => {
    return StageUtils.formatDisplayName({ id: item.id, displayName: item.display_name });
};

export const mapFetchedDeployments = (items: FetchedDeployment[]): DropdownItemProps[] => {
    return items.map(item => {
        return {
            text: formatDropdownItemText(item),
            value: item.id,
            title: item.display_name
        };
    });
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
