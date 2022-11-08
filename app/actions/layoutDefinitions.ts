import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import type { LayoutDefinitions } from '../utils/layoutDefinitionsLoader';
import fetchLayoutDefinitions from '../utils/layoutDefinitionsLoader';

export type StoreLayoutDefinitionsAction = PayloadAction<LayoutDefinitions, ActionType.STORE_LAYOUT_DEFINITIONS>;
export type LayoutDefinitionsAction = StoreLayoutDefinitionsAction;

function storeLayoutDefinitions(layoutDefinitions: LayoutDefinitions): StoreLayoutDefinitionsAction {
    return {
        type: ActionType.STORE_LAYOUT_DEFINITIONS,
        payload: layoutDefinitions
    };
}

export function loadLayoutDefinitions(): ReduxThunkAction<Promise<StoreLayoutDefinitionsAction>> {
    return (dispatch, getState) =>
        fetchLayoutDefinitions(getState().manager).then(result => dispatch(storeLayoutDefinitions(result)));
}
