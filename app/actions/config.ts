// @ts-nocheck File not migrated fully to TS

import * as types from './types';

export function setEditMode(isEditMode) {
    return {
        type: types.SET_CONFIG_EDIT_MODE,
        isEditMode
    };
}
