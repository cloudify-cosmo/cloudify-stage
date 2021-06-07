/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from './types';

export function setValue(key, value) {
    return {
        type: types.SET_CONTEXT_VALUE,
        key,
        value
    };
}

export function clearContext() {
    return {
        type: types.CLEAR_CONTEXT
    };
}
