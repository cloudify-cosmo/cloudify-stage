import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import type { ContextAction } from '../actions/context';

export type ContextData = Record<string, any>;

const context: Reducer<ContextData, ContextAction> = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case ActionType.SET_CONTEXT_VALUE:
            newState = { ...state };
            newState[action.payload.key] = action.payload.value;
            return newState;
        case ActionType.CLEAR_CONTEXT:
            return {};
        default:
            return state;
    }
};

export default context;
