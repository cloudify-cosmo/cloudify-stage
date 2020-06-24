/**
 * Created by kinneretzin on 30/08/2016.
 */

import v4 from 'uuid/v4';
import * as types from '../actions/types';
import StageUtils from '../utils/stageUtils';

function updateWidget(widgets, widgetId, params) {
    return widgets.map(w => {
        if (w.id === widgetId) {
            return { ...w, ...params };
        }
        return w;
    });
}

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
