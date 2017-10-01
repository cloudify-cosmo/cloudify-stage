
import * as types from './types';

import {loadTemplates} from './templates';
import {loadWidgetDefinitions} from './widgets';
import {getTenants} from './tenants';
import {getClientConfig} from './clientConfig';
import {loadOrCreateUserAppData} from './userApp';
import {getUserData, getRBACConfig} from './managers';
import {NO_TENANTS_ERR} from '../utils/ErrorCodes';

export function setAppLoading(isLoading) {
    return {
        type : types.SET_APP_LOADING,
        isLoading
    }
}

export function setAppError(error) {
    return {
        type : types.SET_APP_ERROR,
        error
    }
}

export function intialPageLoad() {
    return function(dispatch,getState) {
        dispatch(setAppLoading(true));
        var state = getState();
        return dispatch(getTenants(state.manager))
            .then(() => {
                if (getState().manager.tenants.items.length === 0) {
                    console.log('User is not attached to any tenant, cannot login');
                    dispatch(setAppLoading(false));
                    return Promise.reject(NO_TENANTS_ERR);
                }
            })
            .then(() => {
                return dispatch(getUserData());
            })
            .then(() => {
                return Promise.all([
                    dispatch(loadTemplates()),
                    dispatch(loadWidgetDefinitions()),
                    dispatch(getRBACConfig()),
                    dispatch(getClientConfig())
                ]);
            })
            .then(() => {
                return dispatch(loadOrCreateUserAppData());
            })
            .then(()=>{
                dispatch(setAppLoading(false));
            })
            .catch(e => {
                console.error('Error initializing user data. Cannot load page', e);
                dispatch(setAppLoading(false));
                return Promise.reject(e);
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