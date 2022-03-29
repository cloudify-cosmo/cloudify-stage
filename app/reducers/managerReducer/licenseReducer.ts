import type { Reducer } from 'redux';
import * as types from '../../actions/types';
import Auth from '../../utils/auth';
import Consts from '../../utils/consts';

type ValueOf<T> = T[keyof T];
export type LicenseStatus = ValueOf<typeof Consts.LICENSE>;
/* eslint-disable camelcase */
export interface LicenseData {
    capabilities: string[] | null;
    cloudify_version: string | null;
    customer_id: string;
    expiration_date: string;
    expired: boolean;
    license_edition: string;
    trial: boolean;
}
/* eslint-enable camelcase */
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
