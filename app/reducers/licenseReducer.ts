import type { Reducer } from 'redux';
import * as types from '../actions/types';
import Auth from '../utils/auth';
import Consts from '../utils/consts';

type ValueOf<T> = T[keyof T];
export type LicenseStatus = ValueOf<typeof Consts.LICENSE>;
export type LicenseData = Record<string, any>;
export interface LicenseObject {
    data?: LicenseData;
    isRequired?: boolean;
    status?: LicenseStatus;
}

const license: Reducer<LicenseObject> = (state = {}, action) => {
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
