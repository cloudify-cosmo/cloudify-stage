import type { BlueprintDetails } from './actions';

export interface BlueprintInfoData extends BlueprintDetails {
    deployments: number;
}
