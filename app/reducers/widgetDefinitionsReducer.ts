import _ from 'lodash';
import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import type { WidgetDefinition } from '../utils/StageAPI';
import type { WidgetDefinitionsAction } from '../actions/widgetDefinitions';

export type WidgetDefinitionsState = WidgetDefinition[];

const widgetDefinitionsReducer: Reducer<WidgetDefinitionsState, WidgetDefinitionsAction> = (state = [], action) => {
    switch (action.type) {
        case ActionType.STORE_WIDGETS_DEFINITIONS:
            return [...action.payload];
        case ActionType.INSTALL_WIDGET:
            return _.sortBy([...state, action.payload], ['name']);
        case ActionType.UPDATE_WIDGET_DEFINITION: {
            const defs = _.reject(state, { id: action.payload.widgetId });
            return _.sortBy([...defs, action.payload.widgetDefinition], ['name']);
        }
        case ActionType.UNINSTALL_WIDGET:
            return _.reject(state, { id: action.payload });

        default:
            return state;
    }
};

export default widgetDefinitionsReducer;
