import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';
import type { PluginAction } from '../actions/plugins';

export interface PluginData {
    uploading?: Record<string, boolean>;
}

const plugins: Reducer<PluginData, PluginAction> = (state = {}, action) => {
    switch (action.type) {
        case ActionType.SET_PLUGIN_UPLOADING:
            return { uploading: { ...state.uploading, [action.payload]: true } };
        case ActionType.UNSET_PLUGIN_UPLOADING: {
            const newState = { uploading: { ...state.uploading } };
            delete newState.uploading[action.payload];
            return newState;
        }
        default:
            return state;
    }
};

export default plugins;
