// @ts-nocheck File not migrated fully to TS

import { ActionType } from '../actions/types';

const context = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case ActionType.SET_CONTEXT_VALUE:
            newState = { ...state };
            newState[action.key] = action.value;
            return newState;
        case ActionType.CLEAR_CONTEXT:
            return {};
        default:
            return state;
    }
};

export default context;
