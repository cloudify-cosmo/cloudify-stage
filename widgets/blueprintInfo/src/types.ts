import type Actions from './actions';

type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never;

export interface BlueprintInfoData extends Unpromise<ReturnType<Actions['doGetBlueprintDetails']>> {
    deployments: number;
}
