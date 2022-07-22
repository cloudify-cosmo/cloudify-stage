import type { Reducer } from 'redux';
import * as types from '../actions/types';

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
        case types.SET_APP_LOADING:
            return { ...state, loading: action.isLoading };
        case types.SET_APP_ERROR:
            return { ...state, error: action.error, loading: false };
        case types.STORE_CURRENT_PAGE:
            return { ...state, currentPageId: action.pageId };
        case types.RES_LOGIN:
            return { ...state, loading: true };
        case types.LOGOUT:
            return { ...state, error: action.error, loading: false };
        default:
            return state;
    }
};

export default app;
