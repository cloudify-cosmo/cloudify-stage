import { isEmpty } from 'lodash';
import { stringify } from 'query-string';
import type { QueryStringParams } from '../../types';

export function getUrlWithQueryString(url: string, params: QueryStringParams = {}) {
    const prefix = url?.includes('?') ? '&' : '?';
    let result = url;

    if (!isEmpty(params)) {
        result += prefix + stringify(params, { sort: false });
    }

    return result;
}
