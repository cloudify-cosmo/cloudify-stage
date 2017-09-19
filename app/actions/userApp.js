/**
 * Created by kinneretzin on 21/02/2017.
 */

import * as types from './types';
import {createPageFromInitialTemplate} from './page';
import {setAppLoading} from './app';
import Internal from '../utils/Internal';
import InitialTemplate from '../utils/InitialTemplate';
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
    return function(dispatch) {
        // First clear the pages
        dispatch(setPages([]));
        dispatch(createPageFromInitialTemplate());
        dispatch(push('/'));
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
                    dispatch(resetTemplate());
                    return dispatch(saveUserAppData(manager, {pages: getState().pages}));
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