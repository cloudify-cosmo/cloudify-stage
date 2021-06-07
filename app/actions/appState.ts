import * as types from './types';

export function setAppLoading(isLoading) {
    return {
        type: types.SET_APP_LOADING,
        isLoading
    };
}

export function setAppError(error) {
    return {
        type: types.SET_APP_ERROR,
        error
    };
}
