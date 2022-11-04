import _ from 'lodash';
import type { Reducer } from 'redux';
import type { PageDefinition } from '../actions/page';
import { ActionType } from '../actions/types';
import type { LayoutDefinitionsAction } from '../actions/layoutDefinitions';
import type { LayoutDefinitions } from '../utils/layoutDefinitionsLoader';
import type { TemplateManagementAction } from '../actions/templateManagement';

export type TemplatePageDefinition = Pick<PageDefinition, 'name' | 'icon' | 'layout'>;

export interface TemplatesState {
    templatesDef: LayoutDefinitions['templatesDef'];
    pagesDef: LayoutDefinitions['pagesDef'];
    pageGroupsDef: LayoutDefinitions['pageGroupsDef'];
}

type TemplatesActions = LayoutDefinitionsAction | TemplateManagementAction;

const templates: Reducer<TemplatesState, TemplatesActions> = (
    state = { templatesDef: {}, pagesDef: {}, pageGroupsDef: {} },
    action
) => {
    switch (action.type) {
        case ActionType.STORE_LAYOUT_DEFINITIONS:
            return { ...action.payload };
        case ActionType.ADD_TEMPLATE:
        case ActionType.EDIT_TEMPLATE:
            return {
                ...state,
                templatesDef: {
                    ...state.templatesDef,
                    [action.payload.templateId]: {
                        ...state?.templatesDef?.[action.payload.templateId],
                        pages: action.payload.pages
                    }
                }
            };
        case ActionType.REMOVE_TEMPLATE:
            return { ...state, templatesDef: _.omit(state.templatesDef, [action.payload]) };
        case ActionType.ADD_TEMPLATE_PAGE:
            return {
                ...state,
                pagesDef: { ...state.pagesDef, [action.payload.id]: _.omit(action.payload, 'id') }
            };
        case ActionType.REMOVE_TEMPLATE_PAGE:
            return { ...state, pagesDef: _.omit(state.pagesDef, [action.payload]) };
        case ActionType.REMOVE_TEMPLATE_PAGE_GROUP:
            return { ...state, pageGroupsDef: _.omit(state.pageGroupsDef, [action.payload]) };
        case ActionType.CREATE_TEMPLATE_PAGE_GROUP:
            return {
                ...state,
                pageGroupsDef: {
                    ...state.pageGroupsDef,
                    [action.payload.pageGroupId]: _.pick(action.payload, 'name', 'pages', 'icon')
                }
            };
        case ActionType.UPDATE_TEMPLATE_PAGE_GROUP:
            return {
                ...state,
                pageGroupsDef: {
                    ..._.omit(state.pageGroupsDef, action.payload.pageGroupId),
                    [action.payload.newId]: _.pick(action.payload, 'name', 'pages', 'icon')
                }
            };
        default:
            return state;
    }
};

export default templates;
