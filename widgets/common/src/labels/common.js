export function addSearchToUrl(url, search) {
    const { appendQueryParam } = Stage.Utils.Url;
    return search ? appendQueryParam(url, '_search', search) : url;
}

export function sortLabels(labels) {
    return _.sortBy(labels, 'key', 'value');
}
