// @ts-nocheck File not migrated fully to TS

import * as types from '../actions/types';

const context = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case types.SET_CONTEXT_VALUE:
            newState = { ...state };
            newState[action.key] = action.value;
            return newState;
        case types.CLEAR_CONTEXT:
            return {};
        default:
            return state;
    }
};

export default context;
