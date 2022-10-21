import type { Reducer } from 'redux';
import { ActionType } from '../actions/types';

export interface AppData {
    loading: boolean;
    error: string | null;
    currentPageId: string | null;
}

const appEmptyState: AppData = {
    loading: true,
    error: null,
    currentPageId: null
};

const app: Reducer<AppData> = (state = appEmptyState, action) => {
    switch (action.type) {
        case ActionType.SET_APP_LOADING:
            return { ...state, loading: action.isLoading };
        case ActionType.SET_APP_ERROR:
            return { ...state, error: action.error, loading: false };
        case ActionType.STORE_CURRENT_PAGE:
            return { ...state, currentPageId: action.pageId };
        case ActionType.RES_LOGIN:
            return { ...state, loading: true };
        case ActionType.LOGOUT:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default app;
