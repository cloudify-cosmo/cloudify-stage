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
            return {...state, [action.templateId]: action.pages};
        case types.REMOVE_TEMPLATE:
            return _.omit(state, [action.templateId]);
        case types.ADD_TEMPLATE_PAGE:
            return {...state, [action.pageId]: {name: action.name, widgets: action.widgets}};
        case types.REMOVE_TEMPLATE_PAGE:
            return _.omit(state, [action.pageId]);
        default:
            return state;
    }
};


export default templates;
