import log from 'loglevel';
import type { PayloadAction, ReduxThunkAction } from './types';
import { ActionType } from './types';
import { setAppError, setAppLoading } from './appState';
import { loadTemplates } from './templates';
import { loadWidgetDefinitions } from './widgets';

import { loadOrCreateUserAppData } from './userApp';
import { getIdentityProviders } from './manager/auth';
import { getClusterStatus } from './manager/clusterStatus';

export type StoreCurrentPageAction = PayloadAction<string, ActionType.STORE_CURRENT_PAGE>;
export type AppAction = StoreCurrentPageAction;

export function intialPageLoad(): ReduxThunkAction {
    return dispatch => {
        dispatch(setAppLoading(true));

        return Promise.all([
            dispatch(loadTemplates()),
            dispatch(loadWidgetDefinitions()),
            dispatch(getClusterStatus()),
            dispatch(getIdentityProviders())
        ])
            .then(() => dispatch(loadOrCreateUserAppData()))
            .then(() => {
                dispatch(setAppLoading(false));
                dispatch(setAppError(null));
            })
            .catch(e => {
                log.error('Error initializing user data. Cannot load page', e);
                dispatch(setAppLoading(false));
                return Promise.reject(e);
            });
    };
}

export function storeCurrentPageId(pageId: string): StoreCurrentPageAction {
    return {
        type: ActionType.STORE_CURRENT_PAGE,
        payload: pageId
    };
}
