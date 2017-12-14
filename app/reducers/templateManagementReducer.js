/**
 * Created by kinneretzin on 30/08/2016.
 */

import {v4} from 'node-uuid';
import * as types from '../actions/types';
import StageUtils from '../utils/stageUtils';

function updateWidget(widgets, widgetId, params) {
    return widgets.map( (w) => {
        if (w.id === widgetId) {
            return {...w, ...params};
        }
        return w
    });
}

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
            return {...state, isPageEditMode: action.isPageEditMode, page: {id: action.pageId, name: action.pageName, widgets: []}};
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
        case types.PAGE_MANAGEMENT_EDIT_WIDGET:
            var widgets = updateWidget(state.page.widgets, action.widgetId, {configuration: action.configuration});
            return {...state, page: {...state.page, widgets}};
        case types.PAGE_MANAGEMENT_MAXIMIZE_WIDGET:
            var widgets = updateWidget(state.page.widgets, action.widgetId, {maximized: action.maximized});
            return {...state, page: {...state.page, widgets}};
        case types.PAGE_MANAGEMENT_CHANGE_WIDGET:
            var params = {
                x: action.gridData.x,
                y: action.gridData.y,
                width: action.gridData.width,
                height: action.gridData.height
            };
            var widgets = updateWidget(state.page.widgets, action.widgetId, params);
            return {...state, page: {...state.page, widgets}};
        case types.TEMPLATE_MANAGEMENT_CLEAR:
            let {pages, templates, ...templateRest} = state;
            return templateRest;
        case types.PAGE_MANAGEMENT_CLEAR:
            let {page, ...pageRest} = state;
            return pageRest;
        case types.PAGE_MANAGEMENT_DRILLDOWN_WARN:
            return {...state, showDrillDownWarn: action.show};
        default:
            return state;
    }
};


export default templates;
