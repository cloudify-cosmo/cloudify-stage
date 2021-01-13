import log from 'loglevel';
import * as types from './types';
import { setAppError, setAppLoading } from './appState';
import { loadTemplates } from './templates';
import { loadTours } from './tours';
import { loadWidgetDefinitions } from './widgets';

import { getClientConfig } from './clientConfig';
import { loadOrCreateUserAppData } from './userApp';
import { getLdap } from './managers';
import { getClusterStatus } from './clusterStatus';

export function intialPageLoad() {
    return (dispatch /* , getState */) => {
        dispatch(setAppLoading(true));

        return Promise.all([
            dispatch(loadTemplates()),
            dispatch(loadTours()),
            dispatch(loadWidgetDefinitions()),
            dispatch(getClientConfig()),
            dispatch(getClusterStatus()),
            dispatch(getLdap())
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

export function toogleSidebar() {
    return {
        type: types.APP_SIDEBAR_TOOGLE
    };
}
