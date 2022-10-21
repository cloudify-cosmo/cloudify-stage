import type { Reducer } from 'redux';
import { ActionType } from '../../actions/types';
import Auth from '../../utils/auth';
import type Consts from '../../utils/consts';
import type { LicenseResponse } from '../../../backend/handler/AuthHandler.types';

type ValueOf<T> = T[keyof T];
export type LicenseStatus = ValueOf<typeof Consts.LICENSE>;

export interface LicenseData {
    data?: LicenseResponse;
    isRequired?: boolean;
    status?: LicenseStatus;
}

const license: Reducer<LicenseData> = (state = {}, { type, license: licenseData, isRequired }) => {
    switch (type) {
        case ActionType.SET_LICENSE_REQUIRED:
            return { ...state, isRequired };
        case ActionType.SET_MANAGER_LICENSE:
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
