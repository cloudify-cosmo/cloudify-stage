import i18n from 'i18next';
import { push } from 'connected-react-router';
import { showAppError } from '../actions/app';
import Consts from './consts';
import { clearContext } from '../actions/context';
import type { ReduxStore } from '../configureStore';

let singleton: Interceptor | null = null;

export default class Interceptor {
    constructor(private store: ReduxStore) {}

    handle401() {
        this.store.dispatch(clearContext());
        this.store.dispatch(push(Consts.PAGE_PATH.LOGIN));
    }

    handleLicenseError(errorCode?: string) {
        if (errorCode === Consts.NO_LICENSE_ERROR_CODE) {
            this.store.dispatch(showAppError(i18n.t('noLicense', 'No active license')));
        } else if (errorCode === Consts.EXPIRED_LICENSE_ERROR_CODE) {
            this.store.dispatch(showAppError(i18n.t('licenseExpired', 'License has expired')));
        }
    }

    static create(store: ReduxStore) {
        singleton = new Interceptor(store);
    }

    static getInterceptor() {
        return singleton;
    }
}
