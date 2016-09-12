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
                plugin: action.plugin.name
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

        default:
            return state;
    }
};


export default widgets;
