import type { Reducer } from 'redux';

import { ActionType } from '../actions/types';

const plugins: Reducer = (state = [], action) => {
    switch (action.type) {
        case ActionType.SET_PLUGIN_UPLOADING:
            return { uploading: { ...state.uploading, [action.pluginUrl]: true } };
        case ActionType.UNSET_PLUGIN_UPLOADING: {
            const newState = { uploading: { ...state.uploading } };
            delete newState.uploading[action.pluginUrl];
            return newState;
        }
        default:
            return state;
    }
};

export default plugins;
