import { SyntheticEvent } from 'react';

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
    display_label?: string;
    display: { rows?: number };
    default: any;
    type: string;
    constraints: Constraint[];
}

export type OnChange = ((event: SyntheticEvent<HTMLElement>, field: any) => void) | undefined;
