import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import type { DrilldownContext, DrilldownContextAction } from '../actions/drilldownContext';

const drillDownContext: Reducer<DrilldownContext[], DrilldownContextAction> = (state = [], action) => {
    let newState: DrilldownContext[];
    switch (action.type) {
        case ActionType.SET_DRILLDOWN_CONTEXT:
            return action.payload;
        case ActionType.POP_DRILLDOWN_CONTEXT:
            newState = [...state];
            newState.splice(-action.payload, action.payload);
            return newState;
        default:
            return state;
    }
};

export default drillDownContext;
