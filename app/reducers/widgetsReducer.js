/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import {v4} from 'node-uuid';

const widget = (state = {}, action) => {
    switch (action.type) {

        case types.ADD_WIDGET:
            return {
                id: v4(),
                name: action.name,
                width: action.plugin.initialWidth,
                height: action.plugin.initialHeight,
                plugin: action.plugin.id,
                configuration: action.plugin.initialConfiguration.map((config)=>{
                    var currConf = Object.assign({},config);
                    if (!currConf.id) {
                        currConf.id = v4();
                    }
                    if (!currConf.name) {
                        currConf.name = currConf.id;
                    }

                    // If we have a default (but not value) set it as the initial value
                    if (config.default && !config.value) {
                        currConf.value = currConf.default;
                    }

                    // If there was no default and no value, set it to null (so it wont be undefined)
                    if (!currConf.value) {
                        currConf.value = null;
                    }

                    // Else all is good return it
                    return currConf;
                })
            };
        default:
            return state;
    }
};

const widgets = (state = [], action) => {
    switch (action.type) {
        case types.ADD_WIDGET:
            return [
                ...state,
                widget(undefined, action)
            ];
        case types.RENAME_WIDGET:
            return state.map( (widget) => {
                if (widget.id === action.widgetId) {
                    return Object.assign({}, widget, {
                        name: action.name
                    })
                }
                return widget
            });
        case types.EDIT_WIDGET:
            return state.map( (widget) => {
                if (widget.id === action.widgetId) {
                    return Object.assign({}, widget, {
                        configuration: action.configuration
                    })
                }
                return widget
            });
        case types.CHANGE_WIDGET_GRID_DATA:
            return state.map( (widget) => {
                if (widget.id === action.widgetId) {
                    return Object.assign({}, widget, {
                        x: action.gridData.x,
                        y: action.gridData.y,
                        width: action.gridData.width,
                        height: action.gridData.height
                    })
                }
                return widget
            });
        case types.REMOVE_WIDGET:
            var removeIndex = _.findIndex(state,{id:action.widgetId});
            return [
                ...state.slice(0,removeIndex),
                ...state.slice(removeIndex+1)
            ];
        case types.SET_DRILLDOWN_PAGE:
            return state.map( (widget) => {
                if (widget.id === action.widgetId) {
                    return Object.assign({}, widget, {
                        drillDownPageId: action.drillDownPageId
                    })
                }
                return widget
            });

        default:
            return state;
    }
};


export default widgets;
