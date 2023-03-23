import type { DependencyList } from 'react';
import { useCallback, useEffect } from 'react';
import { cloneDeep, debounce } from 'lodash';
import type { BlueprintRequirements } from '../../blueprints/BlueprintActions';
import { defaultBlueprintList } from './BlueprintDropdown.consts';
import type { FetchedBlueprint, FilteredBlueprints } from './SuggestedBlueprintDropdown.types';

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

const isBlueprintSuggested = (blueprint: FetchedBlueprint, simplifiedCapabilities: string[]): boolean => {
    const blueprintCapabilities = Object.keys((blueprint as any).capabilities as any);
    const isSuggested = simplifiedCapabilities.every(
        capability =>
            !!blueprintCapabilities.find(
                blueprintCapability => blueprintCapability.toUpperCase() === capability.toUpperCase()
            )
    );

    return isSuggested;
};

export const filterBlueprints = (
    blueprints: FetchedBlueprint[],
    capabilities: BlueprintRequirements['parent_capabilities']
) => {
    const capabilitiesToMatch = simplifyCapabilities(capabilities);

    return blueprints.reduce<FilteredBlueprints>((FilteredBlueprints, blueprint) => {
        const isSuggestedOption = isBlueprintSuggested(blueprint, capabilitiesToMatch);

        if (isSuggestedOption) {
            FilteredBlueprints.suggestedBlueprints.push(blueprint);
        } else {
            FilteredBlueprints.notSuggestedBlueprints.push(blueprint);
        }

        return FilteredBlueprints;
        // NOTE: List is being deep cloned as array mutating operations are being executed above
    }, cloneDeep(defaultBlueprintList));
};
