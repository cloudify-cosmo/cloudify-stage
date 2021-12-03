import { isEmpty } from 'lodash';
import { stringify } from 'query-string';
import type { QueryStringParams } from '../../types';

// eslint-disable-next-line import/prefer-default-export
export function getUrlWithQueryString(url: string, params: QueryStringParams = {}) {
    let result = url;

    if (!isEmpty(params)) {
        result += (url.indexOf('?') > 0 ? '&' : '?') + stringify(params, { sort: false });
    }

    return result;
}
