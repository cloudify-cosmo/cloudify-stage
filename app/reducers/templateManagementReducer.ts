import _ from 'lodash';
import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';

export interface TemplateManagementState {
    showDrillDownWarn?: boolean;
    isActive?: boolean;
    isPageEditMode?: boolean;
}

const templates: Reducer<TemplateManagementState> = (state = {}, action) => {
    switch (action.type) {
        case ActionType.PAGE_MANAGEMENT_DRILLDOWN_WARN:
            return { ...state, showDrillDownWarn: action.show };
        case ActionType.TEMPLATE_MANAGEMENT_ACTIVE:
        case ActionType.PAGE_MANAGEMENT_SET_EDIT_MODE:
            return { ...state, ..._.omit(action, 'type') };
        default:
            return state;
    }
};

export default templates;
