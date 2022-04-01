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

const license: Reducer<LicenseData> = (state = {}, { type, license: licenseData, isRequired }) => {
    switch (type) {
        case types.SET_LICENSE_REQUIRED:
            return { ...state, isRequired };
        case types.SET_MANAGER_LICENSE:
            return {
                ...state,
                data: licenseData,
                status: Auth.getLicenseStatus(licenseData)
            };
        default: {
            return {
                ...state
            };
        }
    }
};

export default license;
