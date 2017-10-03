/**
 * Created by kinneretzin on 30/08/2016.
 */

import {v4} from 'node-uuid';
import * as types from '../actions/types';
import StageUtils from '../utils/stageUtils';

const templates = (state = {}, action) => {
    switch (action.type) {
        case types.TEMPLATE_MANAGEMENT_LOADING:
            return {...state, isLoading: true, error: null};
        case types.TEMPLATE_MANAGEMENT_ERROR:
            return {...state, isLoading: false, error: action.error};
        case types.TEMPLATE_MANAGEMENT_FETCH:
            return {templates: action.templates, pages: action.pages, isLoading: false, error: null};
        case types.TEMPLATE_MANAGEMENT_SELECT:
            return {...state, templates: _.map(state.templates, item => {
                return {...item, selected: !item.selected && item.id === action.templateId}
            })};
        case types.PAGE_MANAGEMENT_SELECT:
            return {...state, pages: _.map(state.pages, item => {
                return {...item, selected: !item.selected && item.id === action.pageId}
            })};
        case types.PAGE_MANAGEMENT_SHOW:
            return {...state, isEditMode: action.isEditMode, page: {id: action.pageId, name: action.pageName, widgets: []}};
        case types.PAGE_MANAGEMENT_CHANGE_NAME:
            return {...state, page: {...state.page, oldId: state.page.id, id: action.pageId, name: action.pageName}};
        case types.PAGE_MANAGEMENT_ADD_WIDGET:
            var widget = {
                id: v4(),
                name: action.name,
                width: action.width || action.widgetDefinition.initialWidth,
                height: action.height || action.widgetDefinition.initialHeight,
                x: action.x,
                y: action.y,
                definition: action.widgetDefinition.id,
                configuration: Object.assign({},StageUtils.buildConfig(action.widgetDefinition),action.configuration),
                drillDownPages: {}
            };

            return {...state, page: {...state.page, widgets: [...state.page.widgets, widget]}};
        case types.PAGE_MANAGEMENT_REMOVE_WIDGET:
            var widgets = _.filter(state.page.widgets, (w) => {
                return w.id !== action.widgetId;
            });

            return {...state, page: {...state.page, widgets}};
        case types.PAGE_MANAGEMENT_CHANGE_WIDGET:
            var widgets = state.page.widgets.map( (w) => {
                if (w.id === action.widgetId) {
                    return {
                        ...w,
                        x: action.gridData.x,
                        y: action.gridData.y,
                        width: action.gridData.width,
                        height: action.gridData.height
                    };
                }
                return w
            });

            return {...state, page: {...state.page, widgets}};
        case types.TEMPLATE_MANAGEMENT_CLEAR:
            return {...state, pages: [], templates: []};
        default:
            return state;
    }
};


export default templates;
