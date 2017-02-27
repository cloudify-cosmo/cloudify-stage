/**
 * Created by kinneretzin on 21/02/2017.
 */

import * as types from './types';
import fetch from 'isomorphic-fetch';
import {createPageFromInitialTemplate} from './page';

const  CURRENT_APP_DATA_VERSION = 1;

function setPages(pages) {
    return {
        type: types.SET_PAGES,
        pages,
        receivedAt: Date.now()
    }
}

export function saveUserAppData (ip,username,role,appData) {
    return function(dispatch) {
        var data = {appData , version: CURRENT_APP_DATA_VERSION};

        return fetch(`/ua/${ip}/${username}/${role}`,{
            method:'post',
            headers: {
                "Content-Type": "application/json"
            },
            body : JSON.stringify(data)
        }).then((response)=>{
            if (!response.ok) {
                return Promise.reject(response.statusText);
            }
        });
    }
}

export function loadOrCreateUserAppData (manager,config,templates,widgetDefinitions) {
    return function(dispatch,getState) {

        return fetch(`/ua/${manager.ip}/${manager.username}/${manager.auth.role}`)
            .then(response => response.json())
            .then(userApp=>{
                if (userApp &&
                    userApp.appDataVersion === CURRENT_APP_DATA_VERSION &&
                    userApp.appData.pages && userApp.appData.pages.length > 0) {
                    dispatch(setPages(userApp.appData.pages));
                } else {
                    // First clear the pages
                    dispatch(setPages([]));

                    // Need to create from initial template
                    var initialTemplateName = config.app['initialTemplate'][config.mode === 'customer' ? 'customer': manager.auth.role] || 'initial-template';
                    var initialTemplate = templates[initialTemplateName];
                    dispatch(createPageFromInitialTemplate(initialTemplate,templates,widgetDefinitions));

                    var data = { pages: getState().pages};
                    return dispatch(saveUserAppData(manager.ip,manager.username,manager.auth.role,data));
                }
            });
    }
}