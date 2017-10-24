/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from '../actions/types';

const templates = (state = {}, action) => {
    switch (action.type) {
        case types.STORE_TEMPLATES:
            return {...action.templates};
        case types.ADD_TEMPLATE:
        case types.EDIT_TEMPLATE:
            return {...state, templatesDef: {...state.templatesDef, [action.templateId]: action.pages}};
        case types.REMOVE_TEMPLATE:
            return {...state, templatesDef: _.omit(state.templatesDef, [action.templateId])};
        case types.ADD_TEMPLATE_PAGE:
            return {...state, pagesDef: {...state.pagesDef, [action.pageId]: {name: action.name, widgets: action.widgets}}};
        case types.REMOVE_TEMPLATE_PAGE:
            return {...state, pagesDef: _.omit(state.pagesDef, [action.pageId])};
        default:
            return state;
    }
};


export default templates;
