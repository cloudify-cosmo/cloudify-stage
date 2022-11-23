import _ from 'lodash';
import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import type { TemplateManagementAction } from '../actions/templateManagement';

export interface TemplateManagementState {
    showDrillDownWarn: boolean;
    isActive: boolean;
    isPageEditMode: boolean;
}

const initialTemplateManagementState: TemplateManagementState = {
    showDrillDownWarn: false,
    isActive: false,
    isPageEditMode: false
};

const templates: Reducer<TemplateManagementState, TemplateManagementAction> = (
    state = initialTemplateManagementState,
    action
) => {
    switch (action.type) {
        case ActionType.PAGE_MANAGEMENT_DRILLDOWN_WARN:
            return { ...state, showDrillDownWarn: action.payload };
        case ActionType.TEMPLATE_MANAGEMENT_ACTIVE:
            return { ...state, isActive: action.payload };
        case ActionType.PAGE_MANAGEMENT_SET_EDIT_MODE:
            return { ...state, isPageEditMode: action.payload };
        default:
            return state;
    }
};

export default templates;
