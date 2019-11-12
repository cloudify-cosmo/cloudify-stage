/**
 * Created by jakub.niezgoda on 07/03/2019.
 */

import * as types from '../actions/types';
import Auth from '../utils/auth';

const license = (state = {}, action) => {
    switch (action.type) {
        case types.RES_LOGIN:
            return { ...state, data: {}, status: '', isRequired: action.licenseRequired };
        case types.SET_MANAGER_LICENSE:
            return { ...state, ...state, data: action.license, status: Auth.getLicenseStatus(action.license) };
        default: {
            return {
                ...state
            };
        }
    }
};

export default license;
