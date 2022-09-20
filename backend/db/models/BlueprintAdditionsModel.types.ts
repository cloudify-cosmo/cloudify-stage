import type { CommonAttributes } from './types';

export interface BlueprintAdditionsData {
    blueprintId: string;
    image: any;
    imageUrl: string;
}

export type BlueprintAdditionsAttributes = CommonAttributes & BlueprintAdditionsData;
