import _ from 'lodash';
import type { Reducer } from 'redux';
import * as types from '../actions/types';

export interface TemplateManagementState {
    showDrillDownWarn?: boolean;
    isActive?: boolean;
    isPageEditMode?: boolean;
}

const templates: Reducer<TemplateManagementState> = (state = {}, action) => {
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
