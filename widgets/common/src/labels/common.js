// eslint-disable-next-line import/prefer-default-export
export function sortLabels(labels) {
    return _.sortBy(labels, 'key', 'value');
}
