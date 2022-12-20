import type { Reducer } from 'redux';
import type { LicenseResponse } from 'backend/handler/AuthHandler.types';
import { ActionType } from '../../actions/types';
import Auth from '../../utils/auth';
import type Consts from '../../utils/consts';
import type { LicenseAction } from '../../actions/manager/license';

type ValueOf<T> = T[keyof T];
export type LicenseStatus = ValueOf<typeof Consts.LICENSE>;

export interface LicenseData {
    data: LicenseResponse | null;
    isRequired?: boolean;
    status?: LicenseStatus;
}

const license: Reducer<LicenseData, LicenseAction> = (state = { data: null }, action) => {
    switch (action.type) {
        case ActionType.SET_LICENSE_REQUIRED:
            return { ...state, isRequired: action.payload };
        case ActionType.SET_MANAGER_LICENSE:
            return {
                ...state,
                data: action.payload,
                status: Auth.getLicenseStatus(action.payload)
            };
        default: {
            return {
                ...state
            };
        }
    }
};

export default license;
