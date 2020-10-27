/**
 * Created by kinneretzin on 10/11/2016.
 */

import _ from 'lodash';
import Cookies from 'js-cookie';

import Consts from './consts';
import StageUtils from './stageUtils';
import External from './External';
import Internal from './Internal';

export default class Auth {
    static login(username, password) {
        const external = new External({ basicAuth: btoa(`${username}:${password}`) });
        return external.doPost(StageUtils.Url.url('/auth/login'), null, null, true, null, true);
    }

    static getUserData(managerData) {
        const internal = new Internal(managerData);
        return internal.doGet('/auth/user', null, true);
    }

    static logout(managerData) {
        const internal = new Internal(managerData);
        return internal.doPost('/auth/logout', null, null, true, null, true);
    }

    static isLoggedIn() {
        return !!Cookies.get(Consts.TOKEN_COOKIE_NAME);
    }

    static isProductOperational(license) {
        const isLicenseRequired = _.get(license, 'isRequired', false);
        const isTrialLicense = _.get(license, 'data.trial', false);
        const licenseStatus = _.get(license, 'status', Consts.LICENSE.EMPTY);

        if (isLicenseRequired) {
            return isTrialLicense
                ? _.isEqual(licenseStatus, Consts.LICENSE.ACTIVE)
                : !_.isEqual(licenseStatus, Consts.LICENSE.EMPTY);
        }

        return true;
    }

    static getLicenseStatus(licenseData) {
        if (_.isEmpty(licenseData)) {
            return Consts.LICENSE.EMPTY;
        }
        if (licenseData.expired) {
            return Consts.LICENSE.EXPIRED;
        }
        return Consts.LICENSE.ACTIVE;
    }
}
