import { push } from 'connected-react-router';
import type { CallHistoryMethodAction } from 'connected-react-router';
import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import Consts from '../utils/consts';

export type SetAppLoadingAction = PayloadAction<boolean, ActionType.SET_APP_LOADING>;
export type SetAppErrorAction = PayloadAction<string | null, ActionType.SET_APP_ERROR>;
export type StoreCurrentPageAction = PayloadAction<string, ActionType.STORE_CURRENT_PAGE>;

export type AppAction = SetAppLoadingAction | SetAppErrorAction | StoreCurrentPageAction;

export function storeCurrentPageId(pageId: string): StoreCurrentPageAction {
    return {
        type: ActionType.STORE_CURRENT_PAGE,
        payload: pageId
    };
}

export function setAppLoading(isLoading: boolean): SetAppLoadingAction {
    return {
        type: ActionType.SET_APP_LOADING,
        payload: isLoading
    };
}

export function setAppError(error: string | null): SetAppErrorAction {
    return {
        type: ActionType.SET_APP_ERROR,
        payload: error
    };
}

export function showAppError(error: string): ReduxThunkAction<void, SetAppErrorAction | CallHistoryMethodAction> {
    return dispatch => {
        dispatch(setAppError(error));
        dispatch(push(Consts.PAGE_PATH.LOGOUT));
    };
}
