// @ts-nocheck File not migrated fully to TS

import * as types from './types';

export function setDrilldownContext(drilldownContext) {
    return {
        type: types.SET_DRILLDOWN_CONTEXT,
        drilldownContext
    };
}

export function popDrilldownContext() {
    return {
        type: types.POP_DRILLDOWN_CONTEXT,
        count: 1
    };
}
