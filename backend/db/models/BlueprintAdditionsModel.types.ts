import type { CommonAttributes } from './types';

export interface BlueprintAdditionsData {
    blueprintId: string;
    image: any;
    imageUrl: string;
}

export interface BlueprintAdditionsAttributes extends CommonAttributes, BlueprintAdditionsData {}
