export interface Label {
    key: string;
    value: string;
}

export interface LabelWithSystemData extends Label {
    isInSystem?: boolean;
}

export type LabelInputType = 'key' | 'value';
