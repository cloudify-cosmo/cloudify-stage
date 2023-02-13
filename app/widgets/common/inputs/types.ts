import type { SyntheticEvent } from 'react';

export interface DataType {
    properties: Record<string, any>;
}

export interface Constraint {
    [name: string]: any;
}

export interface Input {
    name: string;
    description?: string;
    // eslint-disable-next-line camelcase
    item_type?: string;
    // eslint-disable-next-line camelcase
    display_label?: string;
    display: { rows?: number };
    default: any;
    type: string;
    constraints: Constraint[];
    required?: boolean;
}

export type OnChange = ((event: SyntheticEvent<HTMLElement> | null, field: any) => void) | undefined;
