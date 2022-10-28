// @ts-nocheck File not migrated fully to TS

import { ActionType } from './types';

export function setValue(key, value) {
    return {
        type: ActionType.SET_CONTEXT_VALUE,
        key,
        value
    };
}

export function clearContext() {
    return {
        type: ActionType.CLEAR_CONTEXT
    };
}
