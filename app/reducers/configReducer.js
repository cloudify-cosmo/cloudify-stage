import * as types from '../actions/types';

const config = (state = {}, action) => {

    switch (action.type) {

        case types.SET_CONFIG_EDIT_MODE:
            return Object.assign({},state,{
                isEditMode: action.isEditMode
            });
        case types.SET_CLIENT_CONFIG:
            return Object.assign({},state,{
                clientConfig: action.config
            });
        case types.LOGOUT:
            return Object.assign({},state,{
                clientConfig: null,
                isEditMode: false
            });
        default:
            return state;
    }
};

export default config;