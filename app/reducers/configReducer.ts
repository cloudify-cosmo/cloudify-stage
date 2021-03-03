import type { Reducer } from 'redux';

import * as types from '../actions/types';
import type { ClientConfig } from '../utils/ConfigLoader';

export interface ConfigState extends ClientConfig {
    isEditMode?: boolean;
    clientConfig?: any;
}

// NOTE: Initial state is always provided via configureStore
const config: Reducer<ConfigState> = (state = null as any, action) => {
    switch (action.type) {
        case types.SET_CONFIG_EDIT_MODE:
            return { ...state, isEditMode: action.isEditMode };
        case types.SET_CLIENT_CONFIG:
            return { ...state, clientConfig: action.config };
        case types.LOGOUT:
            return { ...state, clientConfig: null, isEditMode: false };
        default:
            return state;
    }
};

export default config;
