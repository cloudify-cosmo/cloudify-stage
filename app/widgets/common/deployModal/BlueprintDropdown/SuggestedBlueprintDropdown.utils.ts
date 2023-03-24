import type { DependencyList } from 'react';
import { useCallback, useEffect } from 'react';
import { cloneDeep, debounce } from 'lodash';
import { defaultBlueprintList } from './BlueprintDropdown.consts';
import type { FetchedBlueprint, FilteredBlueprints } from './SuggestedBlueprintDropdown.types';
import type { FullDeploymentData } from '../../deployments/DeploymentActions';

export function useFetchTrigger(fetchTrigger: () => void, fetchDeps: DependencyList) {
    const delayMs = 500;
    const debouncedFetchTrigger = useCallback(debounce(fetchTrigger, delayMs), []);

    useEffect(() => {
        debouncedFetchTrigger();
    }, fetchDeps);
}

const isBlueprintSuggested = (
    blueprint: FetchedBlueprint,
    environmentCapabilities: FullDeploymentData['capabilities']
): boolean => {
    const blueprintCapabilities =
        blueprint.requirements?.parent_capabilities.map(parentCapability => parentCapability[0]) || [];

    const isSuggested = Object.keys(environmentCapabilities).every(
        capability =>
            !!blueprintCapabilities.find(
                blueprintCapability => blueprintCapability.toUpperCase() === capability.toUpperCase()
            )
    );

    return isSuggested;
};

export const filterBlueprints = (
    blueprints: FetchedBlueprint[],
    environmentCapabilities: FullDeploymentData['capabilities']
) => {
    return blueprints.reduce<FilteredBlueprints>((filteredBlueprints, blueprint) => {
        const isSuggestedOption = isBlueprintSuggested(blueprint, environmentCapabilities);

        if (isSuggestedOption) {
            filteredBlueprints.suggestedBlueprints.push(blueprint);
        } else {
            filteredBlueprints.notSuggestedBlueprints.push(blueprint);
        }

        return filteredBlueprints;
        // NOTE: List is being deep cloned as array mutating operations are being executed above
    }, cloneDeep(defaultBlueprintList));
};
