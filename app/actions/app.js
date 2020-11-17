import log from 'loglevel';

import i18n from 'i18next';
import * as types from './types';
import { setAppError, setAppLoading } from './appState';
import { loadTemplates } from './templates';
import { loadTours } from './tours';
import { loadWidgetDefinitions } from './widgets';
import { getTenants } from './tenants';
import { getClientConfig } from './clientConfig';
import { loadOrCreateUserAppData } from './userApp';
import { getLdap, getUserData } from './managers';
import { getClusterStatus } from './clusterStatus';
import { NO_TENANTS_ERR } from '../utils/ErrorCodes';
import LoaderUtils from '../utils/LoaderUtils';

function loadTranslationOverrides() {
    LoaderUtils.fetchResource('overrides.json', true).then(overrides =>
        i18n.addResourceBundle('en', 'translation', overrides, true, true)
    );
}

export function intialPageLoad() {
    return (dispatch, getState) => {
        dispatch(setAppLoading(true));
        const state = getState();
        return dispatch(getTenants(state.manager))
            .then(() => {
                if (getState().manager.tenants.items.length === 0) {
                    log.log('User is not attached to any tenant, cannot login');
                    dispatch(setAppLoading(false));
                    return Promise.reject(NO_TENANTS_ERR);
                }
                return Promise.resolve();
            })
            .then(() => dispatch(getUserData()))
            .then(() => {
                return Promise.all([
                    dispatch(loadTemplates()),
                    dispatch(loadTours()),
                    dispatch(loadWidgetDefinitions()),
                    dispatch(getClientConfig()),
                    dispatch(getClusterStatus()),
                    dispatch(getLdap()),
                    loadTranslationOverrides()
                ]);
            })
            .then(() => {
                return dispatch(loadOrCreateUserAppData());
            })
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
