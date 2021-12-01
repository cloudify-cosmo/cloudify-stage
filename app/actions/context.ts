// @ts-nocheck File not migrated fully to TS

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
