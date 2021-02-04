// eslint-disable-next-line import/prefer-default-export
export function addSearchToUrl(url, search) {
    const { appendQueryParam } = Stage.Utils.Url;
    return search ? appendQueryParam(url, '_search', search) : url;
}
