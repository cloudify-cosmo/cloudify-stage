
import * as types from './types';

import {getTenants} from './tenants';
import {getClientConfig} from './clientConfig';
import {loadOrCreateUserAppData} from './userApp';
import {getUserData} from './managers';

export function setAppLoading(isLoading) {
    return {
        type : types.SET_APP_LOADING,
        isLoading
    }
}

export function intialPageLoad() {
    return function(dispatch,getState) {
        dispatch(setAppLoading(true));
        return dispatch(getTenants(getState().manager))
            .then(() => {
                if (getState().manager.tenants.items.length === 0) {
                    console.log('User is not attached to any tenant, cannot login');
                    return Promise.reject('User is not attached to any tenant, cannot login');
                }
            })
            .then(() => {
                return dispatch(getUserData());
            })
            .then(() => {
                return Promise.all([
                    dispatch(getClientConfig()),
                    dispatch(loadOrCreateUserAppData(getState().manager, getState().config, getState().templates, getState().widgetDefinitions))
                ]);
            })
            .then(() => {
                dispatch(setAppLoading(false));
            })
            .catch((e) => {
                console.error('Error initializing user data. Cannot load page', e);
                return Promise.reject('Error initializing user data, cannot load page');
            });
    }
}

export function storeCurrentPageId(pageId) {
    return {
        type: types.STORE_CURRENT_PAGE,
        pageId
    }
}


export function toogleSidebar() {
    return {
        type : types.APP_SIDEBAR_TOOGLE
    }
}