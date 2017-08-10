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
        return internal.doPost(`/ua/${manager.username}/${manager.auth.role}`,null,data);
    }
}

export function resetTemplate(manager,config,templates,widgetDefinitions){
    return function(dispatch) {
        // First clear the pages
        dispatch(setPages([]));

        // Need to create from initial template
        var initialTemplateName = InitialTemplate.getName(config, manager);
        var initialTemplate = templates[initialTemplateName];
        dispatch(createPageFromInitialTemplate(initialTemplate,templates,widgetDefinitions));
        dispatch(push('/'));
    }
}

export function loadOrCreateUserAppData (manager,config,templates,widgetDefinitions) {
    return function(dispatch,getState) {

        var internal = new Internal(manager);
        return internal.doGet(`/ua/${manager.username}/${manager.auth.role}`)
            .then(userApp=>{
                if (userApp &&
                    userApp.appDataVersion === CURRENT_APP_DATA_VERSION &&
                    userApp.appData.pages && userApp.appData.pages.length > 0) {
                    dispatch(setPages(userApp.appData.pages));
                } else {
                    dispatch(resetTemplate(manager,config,templates,widgetDefinitions));

                    var data = { pages: getState().pages};
                    return dispatch(saveUserAppData(manager, data));
                }
            });
    }
}

export function reloadUserAppData () {
    return function (dispatch,getState) {
        dispatch(setAppLoading(true));
        var state = getState();
        return dispatch(loadOrCreateUserAppData(state.manager,state.config,state.templates,state.widgetDefinitions))
            .then(()=>{
                dispatch(setAppLoading(false));
            });
    }
}