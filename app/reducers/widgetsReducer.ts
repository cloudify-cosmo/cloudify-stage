import _ from 'lodash';
import v4 from 'uuid/v4';
import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import StageUtils from '../utils/stageUtils';
import type { WidgetAction } from '../actions/widgets';
import type { AddDrilldownPageAction } from '../actions/drilldownPage';
import type { Widget } from '../utils/StageAPI';

const widget: Reducer<Widget, WidgetAction | AddDrilldownPageAction> = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case ActionType.UPDATE_WIDGET:
            return { ...state, ...action.payload.params };
        case ActionType.MINIMIZE_WIDGETS:
        case ActionType.MINIMIZE_TAB_WIDGETS:
            return { ...state, maximized: false };
        case ActionType.ADD_DRILLDOWN_PAGE:
            newState = { ...state, drillDownPages: { ...state.drillDownPages } };
            newState.drillDownPages[action.payload.drillDownName] = action.payload.drillDownPageId;
            return newState;
        default:
            return state;
    }
};

const widgets: Reducer<Widget[], WidgetAction | AddDrilldownPageAction> = (state = [], action) => {
    switch (action.type) {
        case ActionType.ADD_WIDGET:
            if (!action.payload.widgetDefinition) {
                return state;
            }

            return [
                ...state,
                {
                    id: v4(),
                    ..._.pick(action.payload.widget, 'name', 'x', 'y'),
                    width: action.payload.widget.width || action.payload.widgetDefinition.initialWidth,
                    height: action.payload.widget.height || action.payload.widgetDefinition.initialHeight,
                    definition: action.payload.widgetDefinition.id,
                    configuration: {
                        ...StageUtils.buildConfig(action.payload.widgetDefinition),
                        ...action.payload.widget.configuration
                    },
                    drillDownPages: {},
                    maximized: false
                }
            ];
        case ActionType.UPDATE_WIDGET:
            return state.map(w => {
                if (w.id === action.payload.widgetId) {
                    return widget(w, action);
                }
                return w;
            });
        case ActionType.MINIMIZE_WIDGETS:
        case ActionType.MINIMIZE_TAB_WIDGETS:
            return state.map(w => widget(w, action));
        case ActionType.REMOVE_WIDGET:
            return _.reject(state, { id: action.payload.widgetId });
        case ActionType.ADD_DRILLDOWN_PAGE:
            return state.map(w => {
                if (w.id === action.payload.widgetId) {
                    return widget(w, action);
                }
                return w;
            });

        default:
            return state;
    }
};

export default widgets;
