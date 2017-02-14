import * as types from '../actions/types';

const config = (state = {}, action) => {

    switch (action.type) {

        case types.SET_CONFIG_EDIT_MODE:
            return Object.assign({},state,{
                isEditMode: action.isEditMode
            });
        default:
            return state;
    }
};

export default config;