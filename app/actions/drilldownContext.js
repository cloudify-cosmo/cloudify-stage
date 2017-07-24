/**
 * Created by kinneretzin on 09/05/2017.
 */

import * as types from './types';

export function setDrilldownContext(drilldownContext){
    return {
        type: types.SET_DRILLDOWN_CONTEXT,
        drilldownContext
    }
}

export function popDrilldownContext() {
    return {
        type: types.POP_DRILLDOWN_CONTEXT
    };
}
