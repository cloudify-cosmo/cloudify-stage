// @ts-nocheck File not migrated fully to TS
import * as types from './types';

export function setAppLoading(isLoading: boolean) {
    return {
        type: ActionType.SET_APP_LOADING,
        isLoading
    };
}

export function setAppError(error) {
    return {
        type: ActionType.SET_APP_ERROR,
        error
    };
}
