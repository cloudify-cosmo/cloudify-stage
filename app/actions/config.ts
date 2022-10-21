import type { PayloadAction } from './types';
import { ActionType } from './types';

export type SetConfigEditModeAction = PayloadAction<boolean, ActionType.SET_CONFIG_EDIT_MODE>;

export function setEditMode(isEditMode: boolean): SetConfigEditModeAction {
    return {
        type: ActionType.SET_CONFIG_EDIT_MODE,
        payload: isEditMode
    };
}
