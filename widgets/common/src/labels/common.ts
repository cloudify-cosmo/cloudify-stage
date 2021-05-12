import { Label } from './types';

// eslint-disable-next-line import/prefer-default-export
export function sortLabels(labels: Label[]) {
    return _.sortBy(labels, 'key', 'value');
}
