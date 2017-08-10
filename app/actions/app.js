
import * as types from './types';

import {getTenants} from './tenants';
import {getClientConfig} from './clientConfig';
import {loadOrCreateUserAppData} from './userApp';

export function setAppLoading(isLoading) {
    return {
        type : types.SET_APP_LOADING,
        isLoading
    }
}

export function intialPageLoad() {
    return function(dispatch,getState) {
        dispatch(setAppLoading(true));
        var state = getState();
        return dispatch(getTenants(state.manager)).then(()=>{
            if (getState().manager.tenants.items.length === 0) {
                console.log('User is not attached to any tenant, cannot login');
                dispatch(setAppLoading(false));
                return Promise.reject('User is not attached to any tenant, cannot login');
            }

            return Promise.all([
                    dispatch(getClientConfig()),
                    dispatch(loadOrCreateUserAppData(state.manager,state.config,state.templates,state.widgetDefinitions))
                ])
                .then(()=>{
                    dispatch(setAppLoading(false));
                    return Promise.resolve();
                })
                .catch((e)=>{
                    console.error('Error initializing user data. Cannot load page',e);
                    dispatch(setAppLoading(false));
                    return Promise.reject('Error initializing user data, cannot load page')
                });
        });
    }
}

export function toogleSidebar() {
    return {
        type : types.APP_SIDEBAR_TOOGLE
    }
}