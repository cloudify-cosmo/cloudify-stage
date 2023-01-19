import type { Deployment } from '../../deploymentsView/types';

export interface FetchedEnvironment {
    id: string;
    // eslint-disable-next-line
    display_name: string;
    capabilities: Deployment['capabilities'];
}

export interface Environment {
    id: string;
    capabilities: Deployment['capabilities'];
    displayName: string;
}

export type FilteredEnvironments = {
    suggestedEnvironments: Environment[];
    nonSuggestedEnvironments: Environment[];
};
