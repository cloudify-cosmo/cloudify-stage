/**
 * Created by kinneretzin on 30/08/2016.
 */

import v4 from 'uuid/v4';
import * as types from '../actions/types';
import StageUtils from '../utils/stageUtils';

const widget = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case types.ADD_WIDGET:
            return {
                id: v4(),
                ..._.pick(action.widget, 'name', 'x', 'y'),
                width: action.widget.width || action.widgetDefinition.initialWidth,
                height: action.widget.height || action.widgetDefinition.initialHeight,
                definition: action.widgetDefinition.id,
                configuration: { ...StageUtils.buildConfig(action.widgetDefinition), ...action.widget.configuration },
                drillDownPages: {}
            };
        case types.UPDATE_WIDGET:
            return { ...state, ...action.params };
        case types.MINIMIZE_WIDGETS:
            return { ...state, maximized: false };
        case types.ADD_DRILLDOWN_PAGE:
            newState = { ...state, drillDownPages: { ...state.drillDownPages } };
            newState.drillDownPages[action.drillDownName] = action.drillDownPageId;
            return newState;
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

            return [...state, widget(undefined, action)];
        case types.UPDATE_WIDGET:
            return state.map(w => {
                if (w.id === action.widgetId) {
                    return widget(w, action);
                }
                return w;
            });
        case types.MINIMIZE_WIDGETS:
            return state.map(w => {
                if (w.maximized) {
                    return widget(w, action);
                }
                return w;
            });
        case types.REMOVE_WIDGET:
            return _.reject(state, { id: action.widgetId });
        case types.ADD_DRILLDOWN_PAGE:
            return state.map(w => {
                if (w.id === action.widgetId) {
                    return widget(w, action);
                }
                return w;
            });

        default:
            return state;
    }
};

export default widgets;
