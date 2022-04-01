import type { Reducer } from 'redux';
import * as types from '../../actions/types';
import Auth from '../../utils/auth';
import Consts from '../../utils/consts';
import type { LicenseResponse } from '../../../backend/routes/Auth.types';

type ValueOf<T> = T[keyof T];
export type LicenseStatus = ValueOf<typeof Consts.LICENSE>;

export interface LicenseData {
    data?: LicenseResponse;
    isRequired?: boolean;
    status?: LicenseStatus;
}

const license: Reducer<LicenseData> = (state = {}, action) => {
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
