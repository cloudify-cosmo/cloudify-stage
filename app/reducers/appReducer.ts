// @ts-nocheck File not migrated fully to TS

import * as types from '../actions/types';

const app = (state = { loading: true, error: null }, action) => {
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
