import i18n from 'i18next';
import { showAppError } from '../actions/app';
import Consts from './consts';
import type { ReduxStore } from '../configureStore';

let singleton: Interceptor | null = null;

export default class Interceptor {
    constructor(private store: ReduxStore) {}

    handle401() {
        this.store.dispatch(showAppError(i18n.t('errors.unauthorized')));
    }

    handleLicenseError(errorCode?: string) {
        if (errorCode === Consts.NO_LICENSE_ERROR_CODE) {
            this.store.dispatch(showAppError(i18n.t('errors.noLicense')));
        } else if (errorCode === Consts.EXPIRED_LICENSE_ERROR_CODE) {
            this.store.dispatch(showAppError(i18n.t('errors.licenseExpired')));
        }
    }

    static create(store: ReduxStore) {
        singleton = new Interceptor(store);
    }

    static getInterceptor() {
        return singleton;
    }
}
