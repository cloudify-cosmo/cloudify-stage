import { get, isEmpty, isEqual } from 'lodash';

import type { GetAuthManagerResponse, GetAuthUserResponse } from 'backend/routes/Auth.types';
import type { LicenseResponse } from 'backend/handler/AuthHandler.types';
import Consts from './consts';
import StageUtils from './stageUtils';
import External from './External';
import Internal from './Internal';
import encodeTextToBase64 from './encodeTextToBase64';
import type { LicenseData, LicenseStatus, ManagerData } from '../reducers/managerReducer';

export default class Auth {
    static login(username: string, password: string) {
        const external = new External({ basicAuth: encodeTextToBase64(`${username}:${password}`) });
        return external.doPost(StageUtils.Url.url('/auth/login'), { withCredentials: true });
    }

    static getManagerData(managerData: ManagerData) {
        const internal = new Internal(managerData);
        return internal.doGet<GetAuthManagerResponse>('/auth/manager');
    }

    static getUserData(managerData: ManagerData) {
        const internal = new Internal(managerData);
        return internal.doGet<GetAuthUserResponse>('/auth/user');
    }

    static logout(managerData: ManagerData) {
        const internal = new Internal(managerData);
        return internal.doPost('/auth/logout', { withCredentials: true });
    }

    static isProductOperational(license: LicenseData) {
        const isLicenseRequired = get(license, 'isRequired', false);
        const isTrialLicense = get(license, 'data.trial', false);
        const licenseStatus = get(license, 'status', Consts.LICENSE.EMPTY);

        if (isLicenseRequired) {
            return isTrialLicense
                ? isEqual(licenseStatus, Consts.LICENSE.ACTIVE)
                : !isEqual(licenseStatus, Consts.LICENSE.EMPTY);
        }

        return true;
    }

    static getLicenseStatus(licenseData: LicenseResponse | null): LicenseStatus {
        if (licenseData === null || isEmpty(licenseData)) {
            return Consts.LICENSE.EMPTY;
        }
        if (licenseData.expired) {
            return Consts.LICENSE.EXPIRED;
        }
        return Consts.LICENSE.ACTIVE;
    }
}
