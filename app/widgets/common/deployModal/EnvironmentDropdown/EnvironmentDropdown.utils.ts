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

const isEnvironmentSuggested = (environment: Environment, simplifiedCapabilities: string[]): boolean => {
    const environmentCapabilities = Object.keys(environment.capabilities);
    const isSuggested = simplifiedCapabilities.every(
        capability =>
            !!environmentCapabilities.find(
                environmentCapability => environmentCapability.toUpperCase() === capability.toUpperCase()
            )
    );

    return isSuggested;
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
            filteredEnvironments.notSuggestedEnvironments.push(environment);
        }

        return filteredEnvironments;
        // NOTE: List is being deep cloned as array mutating operations are being executed above
    }, cloneDeep(defaultEnvironmentList));
};
