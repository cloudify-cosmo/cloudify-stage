import _ from 'lodash';
import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import type { EnhancedWidgetDefinition, WidgetDefinitionsAction } from '../actions/widgetDefinitions';

const emptyWidgetDefinition: EnhancedWidgetDefinition = {
    id: '',
    categories: [],
    color: 'black',
    name: '',
    hasReadme: false,
    hasStyle: false,
    hasTemplate: false,
    initialConfiguration: [],
    initialHeight: 0,
    initialWidth: 0,
    permission: '',
    showBorder: false,
    showHeader: false,
    supportedEditions: [],
    loaded: false,
    isReact: true,
    render: () => null,
    isCustom: false
};

export type WidgetDefinitionsState = EnhancedWidgetDefinition[];
const widgetDefinitionsReducer: Reducer<WidgetDefinitionsState, WidgetDefinitionsAction> = (
    state: WidgetDefinitionsState = [],
    action
) => {
    switch (action.type) {
        case ActionType.STORE_WIDGETS_DEFINITIONS:
            return action.payload.map(simpleWidgetDefinition => ({
                ...emptyWidgetDefinition,
                ...simpleWidgetDefinition
            }));
        case ActionType.INSTALL_WIDGET:
            return _.sortBy([...state, { ...action.payload, isCustom: true }], ['name']);
        case ActionType.UPDATE_WIDGET_DEFINITION: {
            const { widgetId } = action.payload;
            const updatedWidgetDefinition = _.find(state, { id: widgetId });
            if (updatedWidgetDefinition) {
                const widgetDefinitionsWithoutUpdatedWidget = _.reject(state, { id: widgetId });
                return _.sortBy(
                    [
                        ...widgetDefinitionsWithoutUpdatedWidget,
                        { ...action.payload.widgetDefinition, isCustom: updatedWidgetDefinition.isCustom }
                    ],
                    ['name']
                );
            }
            return state;
        }
        case ActionType.UNINSTALL_WIDGET:
            return _.reject(state, { id: action.payload });

        default:
            return state;
    }
};

export default widgetDefinitionsReducer;
