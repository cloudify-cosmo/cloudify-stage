import _ from 'lodash';
import type { Reducer } from 'redux';

import * as types from '../actions/types';
import type { WidgetDefinition } from '../utils/StageAPI';

export type WidgetDefinitionsState = WidgetDefinition[];

const widgetDefinitionsReducer: Reducer<WidgetDefinitionsState> = (state = [], action) => {
    switch (action.type) {
        case types.STORE_WIDGETS:
            return [...action.widgetDefinitions];
        case types.INSTALL_WIDGET:
            return _.sortBy([...state, action.widgetDefinition], ['name']);
        case types.UPDATE_WIDGET_DEFINITION: {
            const defs = _.reject(state, { id: action.widgetId });
            return _.sortBy([...defs, action.widgetDefinition], ['name']);
        }
        case types.UNINSTALL_WIDGET:
            return _.reject(state, { id: action.widgetId });

        default:
            return state;
    }
};

export default widgetDefinitionsReducer;
