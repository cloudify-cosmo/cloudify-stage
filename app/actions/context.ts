import type { Action } from 'redux';
import type { PayloadAction } from './types';
import { ActionType } from './types';

export type SetContextValueAction = PayloadAction<{ key: string; value: any }, ActionType.SET_CONTEXT_VALUE>;
export type ClearContextAction = Action<ActionType.CLEAR_CONTEXT>;

export type ContextAction = SetContextValueAction | ClearContextAction;

export function setValue(key: string, value: any): SetContextValueAction {
    return {
        type: ActionType.SET_CONTEXT_VALUE,
        payload: { key, value }
    };
}

export function clearContext(): ClearContextAction {
    return {
        type: ActionType.CLEAR_CONTEXT
    };
}
