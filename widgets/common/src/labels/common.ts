import { Label } from './types';

export function sortLabels(labels: Label[]) {
    return _.sortBy(labels, 'key', 'value');
}
