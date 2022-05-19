// @ts-nocheck File not migrated fully to TS
import log from 'loglevel';
import * as types from './types';
import { setAppError, setAppLoading } from './appState';
import { loadTemplates } from './templates';
import { loadWidgetDefinitions } from './widgets';

import { getClientConfig } from './clientConfig';
import { loadOrCreateUserAppData } from './userApp';
import { getIdentityProviders } from './managers';
import { getClusterStatus } from './clusterStatus';

export function intialPageLoad() {
    return (dispatch /* , getState */) => {
        dispatch(setAppLoading(true));

        return Promise.all([
            dispatch(loadTemplates()),
            dispatch(loadWidgetDefinitions()),
            dispatch(getClientConfig()),
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

export function storeCurrentPageId(pageId) {
    return {
        type: types.STORE_CURRENT_PAGE,
        pageId
    };
}
