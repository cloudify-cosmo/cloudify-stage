import type { Reducer } from 'redux';

import type { ClientConfig } from 'backend/routes/Config.types';
import { ActionType } from '../actions/types';
import type { SetConfigEditModeAction } from '../actions/config';
import type { LogoutAction } from '../actions/manager/auth';

export interface ConfigState extends ClientConfig {
    isEditMode?: boolean;
}

type ConfigAction = SetConfigEditModeAction | LogoutAction;

const config: Reducer<ConfigState, ConfigAction> = (state = {} as ConfigState, action) => {
    switch (action.type) {
        case ActionType.SET_CONFIG_EDIT_MODE:
            return { ...state, isEditMode: action.payload };
        case ActionType.LOGOUT:
            return { ...state, isEditMode: false };
        default:
            return state;
    }
};

export default config;
