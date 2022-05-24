import type { Reducer } from 'redux';

import * as types from '../actions/types';
import type { ClientConfig } from '../utils/ConfigLoader';

export interface ConfigState extends ClientConfig {
    isEditMode?: boolean;
}

// NOTE: Initial state is always provided via configureStore
const config: Reducer<ConfigState> = (state = {} as ConfigState, action) => {
    switch (action.type) {
        case types.SET_CONFIG_EDIT_MODE:
            return { ...state, isEditMode: action.isEditMode };
        case types.LOGOUT:
            return { ...state, isEditMode: false };
        default:
            return state;
    }
};

export default config;
