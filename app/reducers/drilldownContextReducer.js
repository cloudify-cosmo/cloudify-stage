/**
 * Created by kinneretzin on 9/5/2017.
 */

import * as types from '../actions/types';

const drillDownContext = (state = [], action) => {
    let newState;
    switch (action.type) {
        case types.SET_DRILLDOWN_CONTEXT:
            return action.drilldownContext;
        case types.POP_DRILLDOWN_CONTEXT:
            newState = [...state];
            newState.splice(-action.count, action.count);
            return newState;
        default:
            return state;
    }
};

export default drillDownContext;
