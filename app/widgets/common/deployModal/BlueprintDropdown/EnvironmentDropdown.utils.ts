import type { DependencyList } from 'react';
import { useCallback, useEffect } from 'react';
import { cloneDeep, debounce } from 'lodash';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import { defaultEnvironmentList } from './EnvironmentDropdown.consts';
import type { FetchedBlueprint, FilteredEnvironments } from './EnvironmentDropdown.types';

export function useFetchTrigger(fetchTrigger: () => void, fetchDeps: DependencyList) {
    const delayMs = 500;
    const debouncedFetchTrigger = useCallback(debounce(fetchTrigger, delayMs), []);

    useEffect(() => {
        debouncedFetchTrigger();
    }, fetchDeps);
}

const simplifyCapabilities = (capabilities: BlueprintRequirements['parent_capabilities']): string[] => {
    return capabilities.map(innerCapabilities => innerCapabilities[0]);
};

const isEnvironmentSuggested = (environment: FetchedBlueprint, simplifiedCapabilities: string[]): boolean => {
    const environmentCapabilities = Object.keys((environment as any).capabilities as any);
    const isSuggested = simplifiedCapabilities.every(
        capability =>
            !!environmentCapabilities.find(
                environmentCapability => environmentCapability.toUpperCase() === capability.toUpperCase()
            )
    );

    return isSuggested;
};

export const filterEnvironments = (
    environments: FetchedBlueprint[],
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
