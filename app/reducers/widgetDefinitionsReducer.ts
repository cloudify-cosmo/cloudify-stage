import _ from 'lodash';
import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import type { WidgetDefinition } from '../utils/StageAPI';

export type WidgetDefinitionsState = WidgetDefinition[];

const widgetDefinitionsReducer: Reducer<WidgetDefinitionsState> = (state = [], action) => {
    switch (action.type) {
        case ActionType.STORE_WIDGETS_DEFINITIONS:
            return [...action.payload.widgetDefinitions];
        case ActionType.INSTALL_WIDGET:
            return _.sortBy([...state, action.widgetDefinition], ['name']);
        case ActionType.UPDATE_WIDGET_DEFINITION: {
            const defs = _.reject(state, { id: action.widgetId });
            return _.sortBy([...defs, action.widgetDefinition], ['name']);
        }
        case ActionType.UNINSTALL_WIDGET:
            return _.reject(state, { id: action.widgetId });

        default:
            return state;
    }
};

export default widgetDefinitionsReducer;
