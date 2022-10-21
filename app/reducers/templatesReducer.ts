import _ from 'lodash';
import type { Reducer } from 'redux';
import type { PageDefinition } from '../actions/page';
import { ActionType } from '../actions/types';

export type TemplatePageDefinition = Pick<PageDefinition, 'name' | 'icon' | 'layout'>;

export interface TemplatesState {
    templatesDef: Record<string, any>;
    pagesDef: Record<string, TemplatePageDefinition>;
    pageGroupsDef: Record<string, { name: string; pages?: string[] }>;
}

const templates: Reducer<TemplatesState> = (state = { templatesDef: {}, pagesDef: {}, pageGroupsDef: {} }, action) => {
    switch (action.type) {
        case ActionType.STORE_TEMPLATES:
            return { ...action.templates };
        case ActionType.ADD_TEMPLATE:
        case ActionType.EDIT_TEMPLATE:
            return {
                ...state,
                templatesDef: {
                    ...state.templatesDef,
                    [action.templateId]: { ...[action.templateId], pages: action.pages }
                }
            };
        case ActionType.REMOVE_TEMPLATE:
            return { ...state, templatesDef: _.omit(state.templatesDef, [action.templateId]) };
        case ActionType.ADD_TEMPLATE_PAGE:
            return {
                ...state,
                pagesDef: { ...state.pagesDef, [action.page.id]: _.omit(action.page, 'id') }
            };
        case ActionType.REMOVE_TEMPLATE_PAGE:
            return { ...state, pagesDef: _.omit(state.pagesDef, [action.pageId]) };
        case ActionType.REMOVE_TEMPLATE_PAGE_GROUP:
            return { ...state, pageGroupsDef: _.omit(state.pageGroupsDef, [action.pageGroupdId]) };
        case ActionType.CREATE_TEMPLATE_PAGE_GROUP:
            return {
                ...state,
                pageGroupsDef: { ...state.pageGroupsDef, [action.pageGroupId]: _.pick(action, 'name', 'pages', 'icon') }
            };
        case ActionType.UPDATE_TEMPLATE_PAGE_GROUP:
            return {
                ...state,
                pageGroupsDef: {
                    ..._.omit(state.pageGroupsDef, action.pageGroupId),
                    [action.newId]: _.pick(action, 'name', 'pages', 'icon')
                }
            };
        default:
            return state;
    }
};

export default templates;
