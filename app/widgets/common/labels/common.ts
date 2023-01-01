import type { Label } from './types';

export function sortLabels(labels: Label[]) {
    return _.sortBy(labels, 'key', 'value');
}

export function isLabelModifiable(key: string) {
    return key !== 'csys-consumer-id' && key !== 'csys-obj-parent';
}
