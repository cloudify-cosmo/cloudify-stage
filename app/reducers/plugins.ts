import type { Reducer } from 'redux';

import * as types from '../actions/types';

const plugins: Reducer = (state = [], action) => {
    switch (action.type) {
        case types.SET_PLUGIN_UPLOADING:
            return { uploading: { ...state.uploading, [action.pluginUrl]: true } };
        case types.UNSET_PLUGIN_UPLOADING: {
            const newState = { uploading: { ...state.uploading } };
            delete newState.uploading[action.pluginUrl];
            return newState;
        }
        default:
            return state;
    }
};

export default plugins;
