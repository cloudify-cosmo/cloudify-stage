import * as types from '../actions/types';

const config = (state = {}, action) => {
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
