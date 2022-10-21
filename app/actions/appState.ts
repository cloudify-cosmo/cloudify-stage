import { push } from 'connected-react-router';
import type { ThunkAction } from 'redux-thunk';
import type { AnyAction } from 'redux';
import type { PayloadAction } from './types';
import { ActionType } from './types';
import { clearContext } from './context';
import Consts from '../utils/consts';
import type { ReduxState } from '../reducers';

export type SetAppLoadingAction = PayloadAction<boolean, ActionType.SET_APP_LOADING>;
export type SetAppErrorAction = PayloadAction<string | null, ActionType.SET_APP_ERROR>;
export type AppStateAction = SetAppLoadingAction | SetAppErrorAction;

export function setAppLoading(isLoading: boolean): SetAppLoadingAction {
    return {
        type: ActionType.SET_APP_LOADING,
        payload: isLoading
    };
}

export function setAppError(error: string | null) {
    return {
        type: ActionType.SET_APP_ERROR,
        payload: error
    };
}

export function showAppError(error: string): ThunkAction<void, ReduxState, never, AnyAction> {
    return dispatch => {
        dispatch(clearContext());
        dispatch(setAppError(error));
        dispatch(push(Consts.PAGE_PATH.ERROR));
    };
}
