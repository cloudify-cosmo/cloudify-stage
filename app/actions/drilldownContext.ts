import * as types from './types';
import type { DrilldownContext } from '../reducers/drilldownContextReducer';

export function setDrilldownContext(drilldownContext: DrilldownContext[]) {
    return {
        type: types.SET_DRILLDOWN_CONTEXT,
        drilldownContext
    };
}

export function popDrilldownContext(count = 1) {
    return {
        type: types.POP_DRILLDOWN_CONTEXT,
        count
    };
}
