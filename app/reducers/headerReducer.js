import * as types from '../actions/types';

const header = (state = {}, action) => {
    switch (action.type) {

        case types.SET_DASHBOARD_EDIT_MODE:
            return {
                isEditMode: action.isEditMode
            };
        default:
            return state;
    }
};

export default header;