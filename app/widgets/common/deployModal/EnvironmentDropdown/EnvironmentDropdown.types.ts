import type { Deployment } from '../../deploymentsView/types';

export interface FetchedEnvironment {
    id: Deployment['id'];
    // eslint-disable-next-line
    display_name: Deployment['display_name'];
    capabilities: Deployment['capabilities'];
}

export interface Environment {
    id: FetchedEnvironment['id'];
    capabilities: FetchedEnvironment['capabilities'];
    displayName: FetchedEnvironment['display_name'];
}

export type FilteredEnvironments = {
    suggestedEnvironments: Environment[];
    nonSuggestedEnvironments: Environment[];
};
