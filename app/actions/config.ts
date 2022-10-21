import { ActionType } from './types';

export function setEditMode(isEditMode: boolean) {
    return {
        type: ActionType.SET_CONFIG_EDIT_MODE,
        isEditMode
    };
}
