import { cloneDeep } from 'lodash';
import StageUtils from '../../../../utils/stageUtils';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';
import type { Environment, FetchedEnvironment, FilteredEnvironments } from './EnvironmentDropdown.types';

const formatEnvironmentDisplayName = (environment: FetchedEnvironment) => {
    return StageUtils.formatDisplayName({ id: environment.id, displayName: environment.display_name });
};

export const mapFetchedEnvironments = (fetchedEnvironments: FetchedEnvironment[]): Environment[] => {
    return fetchedEnvironments.map(fetchedEnvironment => {
        return {
            id: fetchedEnvironment.id,
            displayName: formatEnvironmentDisplayName(fetchedEnvironment),
            capabilities: fetchedEnvironment.capabilities
        };
    });
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
        // NOTE: List is being deep cloned as array mutating operations are being executed above
    }, cloneDeep(defaultEnvironmentList));
};
