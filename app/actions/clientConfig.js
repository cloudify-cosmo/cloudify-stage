/**
 * Created by addihorowitz on 19/09/2016.
 */

import * as types from './types';
import Internal from '../utils/Internal';

function setClientConfig(config) {
    return {
        type: types.SET_CLIENT_CONFIG,
        config,
        receivedAt: Date.now()
    }
}

export function getClientConfig() {
    return function(dispatch,getState) {
        var internal = new Internal(getState().manager);
        return internal.doGet('/clientConfig').then(response=>{
            dispatch(setClientConfig(response.config))
        });
    }
}

export function saveClientConfig(config) {
    return function(dispatch,getState) {
        var internal = new Internal(getState().manager);
        return internal.doPost('/clientConfig',null,config).then(response=>{
            dispatch(setClientConfig(response.config))
        });
    }
}

