import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import type { PayloadAction } from './types';
import { ActionType } from './types';
import type { LayoutDefinitions } from '../utils/layoutDefinitionsLoader';
import fetchLayoutDefinitions from '../utils/layoutDefinitionsLoader';
import type { ReduxState } from '../reducers';
import type { WidgetsDefinitions } from '../utils/widgetDefinitionsLoader';
import widgetDefinitionLoader from '../utils/widgetDefinitionsLoader';

export type StoreLayoutDefinitionsAction = PayloadAction<LayoutDefinitions, ActionType.STORE_LAYOUT_DEFINITIONS>;
export type StoreWidgetsDefinitionsAction = PayloadAction<WidgetsDefinitions, ActionType.STORE_WIDGETS_DEFINITIONS>;
export type LayoutDefinitionsAction = StoreLayoutDefinitionsAction | StoreWidgetsDefinitionsAction;

function storeLayoutDefinitions(layoutDefinitions: LayoutDefinitions): StoreLayoutDefinitionsAction {
    return {
        type: ActionType.STORE_LAYOUT_DEFINITIONS,
        payload: layoutDefinitions
    };
}

export function loadLayoutDefinitions(): ThunkAction<
    Promise<StoreLayoutDefinitionsAction>,
    ReduxState,
    never,
    AnyAction
> {
    return (dispatch, getState) =>
        fetchLayoutDefinitions(getState().manager).then(result => dispatch(storeLayoutDefinitions(result)));
}

function storeWidgetDefinitions(widgetDefinitions: WidgetsDefinitions): StoreWidgetsDefinitionsAction {
    return {
        type: ActionType.STORE_WIDGETS_DEFINITIONS,
        payload: widgetDefinitions
    };
}

export function loadWidgetDefinitions(): ThunkAction<
    Promise<StoreWidgetsDefinitionsAction>,
    ReduxState,
    never,
    AnyAction
> {
    return (dispatch, getState) =>
        widgetDefinitionLoader.load(getState().manager).then(result => dispatch(storeWidgetDefinitions(result)));
}
