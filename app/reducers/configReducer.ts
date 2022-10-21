import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import type { ClientConfig } from '../../backend/routes/Config.types';

export interface ConfigState extends ClientConfig {
    isEditMode?: boolean;
}

// NOTE: Initial state is always provided via configureStore
const config: Reducer<ConfigState> = (state = {} as ConfigState, action) => {
    switch (action.type) {
        case ActionType.SET_CONFIG_EDIT_MODE:
            return { ...state, isEditMode: action.isEditMode };
        case ActionType.LOGOUT:
            return { ...state, isEditMode: false };
        default:
            return state;
    }
};

export default config;
