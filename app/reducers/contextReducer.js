/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const contextReducer = (state = {}, action) => {
    switch (action.type) {
        case types.SET_CONTEXT_VALUE:
            var newState = Object.assign({}.state);
            newState[action.key] = value;
            return newState;
        default:
            return state;
    }
};


export default contextReducer;
