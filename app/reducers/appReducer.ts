import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import type { AppStateAction } from '../actions/appState';
import type { AppAction } from '../actions/app';
import type { LogoutAction, ReceiveLoginAction } from '../actions/manager/auth';

export interface AppData {
    loading: boolean;
    error?: string | null;
    currentPageId: string | null;
}

const appEmptyState: AppData = {
    loading: true,
    error: null,
    currentPageId: null
};

const app: Reducer<AppData, AppStateAction | AppAction | ReceiveLoginAction | LogoutAction> = (
    state = appEmptyState,
    action
) => {
    switch (action.type) {
        case ActionType.SET_APP_LOADING:
            return { ...state, loading: action.payload };
        case ActionType.SET_APP_ERROR:
            return { ...state, error: action.payload, loading: false };
        case ActionType.STORE_CURRENT_PAGE:
            return { ...state, currentPageId: action.payload };
        case ActionType.RES_LOGIN:
            return { ...state, loading: true };
        case ActionType.LOGOUT:
            return { ...state, error: action.payload.error, loading: false };
        default:
            return state;
    }
};

export default app;
