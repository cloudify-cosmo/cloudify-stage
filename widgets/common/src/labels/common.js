// eslint-disable-next-line import/prefer-default-export
export function addSearchToUrl(url, search) {
    return search ? `${url}?_search=${search}` : url;
}
