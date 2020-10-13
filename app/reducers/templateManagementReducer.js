/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from '../actions/types';

const templates = (state = {}, action) => {
    switch (action.type) {
        case types.PAGE_MANAGEMENT_DRILLDOWN_WARN:
            return { ...state, showDrillDownWarn: action.show };
        case types.TEMPLATE_MANAGEMENT_ACTIVE:
        case types.PAGE_MANAGEMENT_SET_EDIT_MODE:
            return { ...state, ..._.omit(action, 'type') };
        default:
            return state;
    }
};

export default templates;
