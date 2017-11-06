/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import {v4} from 'node-uuid';
import StageUtils from '../utils/stageUtils';

const widget = (state = {}, action) => {
    switch (action.type) {

        case types.ADD_WIDGET:
            return {
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
        case types.RENAME_WIDGET:
            return Object.assign({}, state, {
                name: action.name
            });
        case types.EDIT_WIDGET:
            return Object.assign({}, state, {
                configuration: action.configuration
            });
        case types.MAXIMIZE_WIDGET:
            return Object.assign({}, state, {
                maximized: action.maximized
            });
        case types.MINIMIZE_WIDGETS:
            return Object.assign({}, state, {
                maximized: false
            });
        case types.CHANGE_WIDGET_GRID_DATA:
            return Object.assign({}, state, {
                x: action.gridData.x,
                y: action.gridData.y,
                width: action.gridData.width,
                height: action.gridData.height
            });

        case types.ADD_DRILLDOWN_PAGE:
            var newW = Object.assign({}, state, {
                drillDownPages: Object.assign({},state.drillDownPages)
            });
            newW.drillDownPages[action.drillDownName] = action.drillDownPageId;
            return newW;
        default:
            return state;
    }
};

const widgets = (state = [], action) => {
    switch (action.type) {
        case types.ADD_WIDGET:
            if (!action.widgetDefinition) {
                return state;
            }

            return [
                ...state,
                widget(undefined, action)
            ];
        case types.RENAME_WIDGET:

            return state.map( (w) => {
                if (w.id === action.widgetId) {
                    return widget(w,action);
                }
                return w
            });
        case types.EDIT_WIDGET:
            return state.map( (w) => {
                if (w.id === action.widgetId) {
                    return widget(w,action)
                }
                return w
            });
        case types.MAXIMIZE_WIDGET:
            return state.map( (w) => {
                if (w.id === action.widgetId) {
                    return widget(w,action);
                }
                return w
            });
        case types.MINIMIZE_WIDGETS:
            return state.map( (w) => {
                if (w.maximized) {
                    return widget(w,action);
                }
                return w
            });
        case types.CHANGE_WIDGET_GRID_DATA:
            return state.map( (w) => {
                if (w.id === action.widgetId) {
                    return widget(w,action);
                }
                return w
            });
        case types.REMOVE_WIDGET:
            var removeIndex = _.findIndex(state,{id:action.widgetId});
            return [
                ...state.slice(0,removeIndex),
                ...state.slice(removeIndex+1)
            ];
        case types.ADD_DRILLDOWN_PAGE:
            return state.map( (w) => {
                if (w.id === action.widgetId) {
                    return widget(w,action);
                }
                return w;
            });

        default:
            return state;
    }
};


export default widgets;
