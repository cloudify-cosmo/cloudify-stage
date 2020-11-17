/**
 * Created by edenp on 08/11/2017.
 */
import i18n from 'i18next';
import { push } from 'connected-react-router';
import { showAppError } from '../actions/auth';
import Consts from './consts';
import { clearContext } from '../actions/context';

let singleton = null;

export default class Interceptor {
    constructor(store) {
        this.store = store;
    }

    handle401() {
        this.store.dispatch(clearContext());
        this.store.dispatch(push(Consts.LOGIN_PAGE_PATH));
    }

    handleLicenseError(errorCode) {
        if (errorCode === Consts.NO_LICENSE_ERROR_CODE) {
            this.store.dispatch(showAppError(i18n.t('noLicense', 'No active license')));
        } else if (errorCode === Consts.EXPIRED_LICENSE_ERROR_CODE) {
            this.store.dispatch(showAppError(i18n.t('licenseExpired', 'License has expired')));
        }
    }

    static create(store) {
        singleton = new Interceptor(store);
    }

    static getInterceptor() {
        return singleton;
    }
}
