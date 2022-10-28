import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';

export interface DrilldownContext {
    pageName?: string;
    context?: Record<string, any>;
}

const drillDownContext: Reducer<DrilldownContext[]> = (state = [], action) => {
    let newState: DrilldownContext[];
    switch (action.type) {
        case ActionType.SET_DRILLDOWN_CONTEXT:
            return action.drilldownContext;
        case ActionType.POP_DRILLDOWN_CONTEXT:
            newState = [...state];
            newState.splice(-action.count, action.count);
            return newState;
        default:
            return state;
    }
};

export default drillDownContext;
