import type { CommonAttributes } from './types';

export interface BlueprintUserData {
    blueprintId: string;
    username: string;
    layout: any;
}
export type BlueprintUserDataAttributes = CommonAttributes & BlueprintUserData;
