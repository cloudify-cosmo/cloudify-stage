import _ from 'lodash';
import type { Reducer } from 'redux';
import type { PageDefinition } from '../actions/page';
import * as types from '../actions/types';

export type TemplatePageDefinition = Pick<PageDefinition, 'name' | 'layout'>;

export interface TemplatesState {
    templatesDef: Record<string, any>;
    pagesDef: Record<string, TemplatePageDefinition>;
    pageGroupsDef: Record<string, { name?: string; pages?: string[] }>;
}

const templates: Reducer<TemplatesState> = (state = { templatesDef: {}, pagesDef: {}, pageGroupsDef: {} }, action) => {
    switch (action.type) {
        case types.STORE_TEMPLATES:
            return { ...action.templates };
        case types.ADD_TEMPLATE:
        case types.EDIT_TEMPLATE:
            return {
                ...state,
                templatesDef: {
                    ...state.templatesDef,
                    [action.templateId]: { ...[action.templateId], pages: action.pages }
                }
            };
        case types.REMOVE_TEMPLATE:
            return { ...state, templatesDef: _.omit(state.templatesDef, [action.templateId]) };
        case types.ADD_TEMPLATE_PAGE:
            return {
                ...state,
                pagesDef: { ...state.pagesDef, [action.page.id]: _.omit(action.page, 'id') }
            };
        case types.REMOVE_TEMPLATE_PAGE:
            return { ...state, pagesDef: _.omit(state.pagesDef, [action.pageId]) };
        default:
            return state;
    }
};

export default templates;
