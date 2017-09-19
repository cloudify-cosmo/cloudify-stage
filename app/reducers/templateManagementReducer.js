/**
 * Created by kinneretzin on 30/08/2016.
 */

import * as types from '../actions/types';

const templates = (state = {}, action) => {
    switch (action.type) {
        case types.TEMPLATE_MANAGEMENT_LOADING:
            return {...state, isLoading: true, error: null};
        case types.TEMPLATE_MANAGEMENT_ERROR:
            return {...state, isLoading: false, error: action.error};
        case types.TEMPLATE_MANAGEMENT_FETCH:
            return {templates: action.templates, pages: action.pages, isLoading: false, error: null};
        case types.TEMPLATE_MANAGEMENT_SEL_TEMPLATE:
            return {...state, templates: _.map(state.templates, item => {
                return {...item, selected: !item.selected && item.id === action.templateId}
            })};
        case types.TEMPLATE_MANAGEMENT_SEL_PAGE:
            return {...state, pages: _.map(state.pages, item => {
                return {...item, selected: !item.selected && item.id === action.pageId}
            })};
        case types.TEMPLATE_MANAGEMENT_CLEAR:
            return {};
        default:
            return state;
    }
};


export default templates;
