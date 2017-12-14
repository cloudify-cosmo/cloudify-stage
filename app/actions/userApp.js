/**
 * Created by kinneretzin on 21/02/2017.
 */

import * as types from './types';
import {createPagesFromTemplate} from './page';
import {setAppLoading, setAppError} from './app';
import Internal from '../utils/Internal';
import { push } from 'react-router-redux';
import Consts from '../utils/consts';

const  CURRENT_APP_DATA_VERSION = 4;

function setPages(pages) {
    return {
        type: types.SET_PAGES,
        pages,
        receivedAt: Date.now()
    }
}

export function resetPagesForTenant(tenant) {
    return function(dispatch, getState) {
        let manager = getState().manager;
        if (_.get(manager, 'tenants.selected', Consts.DEFAULT_ALL) === tenant) {
            dispatch(resetPages());
        } else {
            let internal = new Internal(getState().manager);
            return internal.doGet('ua/clear-pages', {tenant});
        }
    }
}

export function saveUserAppData (manager, appData) {
    return function() {
        var data = {appData , version: CURRENT_APP_DATA_VERSION};

        var internal = new Internal(manager);
        return internal.doPost('/ua',null,data);
    }
}

export function resetPages(){
    return function(dispatch) {
        // First clear the pages
        dispatch(setAppLoading(true));
        dispatch(setPages([]));
        return dispatch(createPagesFromTemplate())
            .then(() => {
                dispatch(setAppLoading(false))
                dispatch(push('/'));
            })
            .catch(err => {
                dispatch(setAppError(err.message));
                dispatch(push('error'));
                throw err;
            });
    }
}

export function loadOrCreateUserAppData() {
    return function(dispatch,getState) {

        var manager = getState().manager;

        var internal = new Internal(manager);
        return internal.doGet('/ua')
            .then(userApp=>{
                if (userApp &&
                    userApp.appDataVersion === CURRENT_APP_DATA_VERSION &&
                    userApp.appData.pages && userApp.appData.pages.length > 0) {
                    return dispatch(setPages(userApp.appData.pages));
                } else {
                    return dispatch(resetPages());
                }
            });
    }
}

export function reloadUserAppData () {
    return function (dispatch,getState) {
        dispatch(setAppLoading(true));

        return dispatch(loadOrCreateUserAppData())
            .then(() => {
                let getPageById = (pages, pageId) => {
                    return _.find(pages, {id: pageId});
                };

                var state = getState();
                var currentPageId = state.app.currentPageId;
                var pages = state.pages;
                var page = getPageById(pages, currentPageId);
                if(!page){
                    dispatch(push('/'));
                } else if(page.isDrillDown) {
                    var parent = getPageById(pages, page.parent);
                    if(!parent) {
                        dispatch(push('/'));
                    } else {
                        dispatch(push('/page/'+parent.id));
                    }
                }

                dispatch(setAppLoading(false));
            });
    }
}