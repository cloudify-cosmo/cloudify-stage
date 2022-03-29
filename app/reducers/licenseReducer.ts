// @ts-nocheck File not migrated fully to TS

import * as types from '../actions/types';
import Auth from '../utils/auth';

const license = (state = {}, action) => {
    switch (action.type) {
        case types.SET_LICENSE_REQUIRED:
            return { ...state, isRequired: action.isRequired };
        case types.SET_MANAGER_LICENSE:
            return {
                ...state,
                data: action.license,
                status: Auth.getLicenseStatus(action.license)
            };
        default: {
            return {
                ...state
            };
        }
    }
};

export default license;
