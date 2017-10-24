/**
 * Created by kinneretzin on 21/02/2017.
 */

import * as types from './types';
import {createPagesFromTemplate} from './page';
import {setAppLoading, setAppError} from './app';
import Internal from '../utils/Internal';
import { push } from 'react-router-redux';

const  CURRENT_APP_DATA_VERSION = 4;

function setPages(pages) {
    return {
        type: types.SET_PAGES,
        pages,
        receivedAt: Date.now()
    }
}

export function saveUserAppData (manager, appData) {
    return function(dispatch) {
        var data = {appData , version: CURRENT_APP_DATA_VERSION};

        var internal = new Internal(manager);
        return internal.doPost('/ua',null,data);
    }
}

export function resetTemplate(){
    return function(dispatch, getState) {
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
                    return dispatch(resetTemplate());
                }
            });
    }
}

export function reloadUserAppData () {
    return function (dispatch,getState) {
        dispatch(setAppLoading(true));
        var state = getState();
        return dispatch(loadOrCreateUserAppData())
            .then(() => dispatch(setAppLoading(false)));
    }
}