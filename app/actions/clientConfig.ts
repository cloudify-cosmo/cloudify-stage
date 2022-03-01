// @ts-nocheck File not migrated fully to TS

import * as types from './types';
import Internal from '../utils/Internal';

function setClientConfig(config) {
    return {
        type: types.SET_CLIENT_CONFIG,
        config,
        receivedAt: Date.now()
    };
}

export function getClientConfig() {
    return (dispatch, getState) => {
        const internal = new Internal(getState().manager);
        return internal.doGet('/clientConfig').then(response => dispatch(setClientConfig(response.config)));
    };
}

export function saveClientConfig(body) {
    return (dispatch, getState) => {
        const internal = new Internal(getState().manager);
        return internal.doPost('/clientConfig', { body }).then(response => {
            dispatch(setClientConfig(response.config));
        });
    };
}
