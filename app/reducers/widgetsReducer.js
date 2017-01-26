/**
 * Created by kinneretzin on 30/08/2016.
 */


import * as types from '../actions/types';
import {v4} from 'node-uuid';

let buildConfig = (widgetDefinition)=>{

    var configs = {};

    _.each(widgetDefinition.initialConfiguration,(config)=>{
        if (!config.id) {
            console.log('Cannot process config for widget :"'+widgetDefinition.name+'" , because it missing an Id ',config);
            return;
        }

        var value = config.default && !config.value ? config.default : (_.isUndefined(config.value) ? null : config.value );

        if (config.type == Stage.Basic.GenericField.MULTI_SELECT_LIST_TYPE) {
            value = _.split(value, ',');
        } else if (config.type == Stage.Basic.GenericField.BOOLEAN_TYPE) {
            value = (_.isBoolean(value) && value) || (_.isString(value) && value === "true");
        } else if (config.type === Stage.Basic.GenericField.NUMBER_LIST_TYPE || config.type === Stage.Basic.GenericField.NUMBER_EDITABLE_LIST_TYPE) {
            value = parseInt(value) || 0;
        }

        configs[config.id] = value;
    });

    return configs;
};

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
                configuration: Object.assign({},buildConfig(action.widgetDefinition),action.configuration)
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
