import { ActionType } from './types';
import type { DrilldownContext } from '../reducers/drilldownContextReducer';

export function setDrilldownContext(drilldownContext: DrilldownContext[]) {
    return {
        type: ActionType.SET_DRILLDOWN_CONTEXT,
        drilldownContext
    };
}

export function popDrilldownContext(count = 1) {
    return {
        type: ActionType.POP_DRILLDOWN_CONTEXT,
        count
    };
}
