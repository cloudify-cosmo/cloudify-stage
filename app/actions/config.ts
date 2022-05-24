import * as types from './types';

export function setEditMode(isEditMode: boolean) {
    return {
        type: types.SET_CONFIG_EDIT_MODE,
        isEditMode
    };
}
