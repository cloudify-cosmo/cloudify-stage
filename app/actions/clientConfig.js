/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import External from '../utils/External';

function setClientConfig(config) {
    return {
        type: types.SET_CLIENT_CONFIG,
        config,
        receivedAt: Date.now()
    }
}


export function getClientConfig() {
    return function(dispatch,getState) {
        var ip = getState().manager.ip;
        var external = new External();
        return external.doGet(`/clientConfig/${ip}`).then(response=>{
            dispatch(setClientConfig(response.config))
        });
    }
}

export function saveClientConfig(config) {
    return function(dispatch,getState) {
        var ip = getState().manager.ip;
        var external = new External();
        return external.doPost(`/clientConfig/${ip}`,null,config).then(response=>{
            dispatch(setClientConfig(response.config))
        });
    }
}

