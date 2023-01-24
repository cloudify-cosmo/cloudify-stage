import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';
import type { AppAction } from '../actions/app';
import type { LogoutAction, LoginSuccessAction } from '../actions/manager/auth';

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

const app: Reducer<AppData, AppAction | LoginSuccessAction | LogoutAction> = (state = appEmptyState, action) => {
    switch (action.type) {
        case ActionType.SET_APP_LOADING:
            return { ...state, loading: action.payload };
        case ActionType.SET_APP_ERROR:
            return { ...state, error: action.payload, loading: false };
        case ActionType.STORE_CURRENT_PAGE:
            return { ...state, currentPageId: action.payload };
        case ActionType.LOGIN_SUCCESS:
            return { ...state, loading: true };
        case ActionType.LOGOUT:
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default app;
