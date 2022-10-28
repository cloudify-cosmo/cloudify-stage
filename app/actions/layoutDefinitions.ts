import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import type { PayloadAction } from './types';
import { ActionType } from './types';
import type { LayoutDefinitions } from '../utils/layoutDefinitionsLoader';
import fetchLayoutDefinitions from '../utils/layoutDefinitionsLoader';
import type { ReduxState } from '../reducers';

export type StoreLayoutDefinitionsAction = PayloadAction<LayoutDefinitions, ActionType.STORE_LAYOUT_DEFINITIONS>;
export type LayoutDefinitionsAction = StoreLayoutDefinitionsAction;

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
