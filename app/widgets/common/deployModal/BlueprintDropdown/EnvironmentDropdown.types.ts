import type { FullBlueprintData } from '../../blueprints/BlueprintActions';

export type FetchedBlueprint = Pick<FullBlueprintData, 'id' | 'requirements'>;

export type FilteredEnvironments = {
    suggestedEnvironments: FetchedBlueprint[];
    notSuggestedEnvironments: FetchedBlueprint[];
};
