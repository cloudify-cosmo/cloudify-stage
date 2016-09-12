/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';

const context = (state = {}, action) => {
    switch (action.type) {
        case types.SET_CONTEXT_VALUE:
            var newState = Object.assign({},state);
            newState[action.key] = action.value;
            return newState;
        default:
            return state;
    }
};


export default context;
