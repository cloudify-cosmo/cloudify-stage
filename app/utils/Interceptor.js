/**
 * Created by edenp on 08/11/2017.
 */

import { push } from 'connected-react-router';
import { showAppError } from '../actions/auth';
import Consts from './consts';
import { clearContext } from '../actions/context';

let singleton = null;

export default class Interceptor {
    constructor(store) {
        this._store = store;
    }

    handle401() {
        this._store.dispatch(clearContext());
        this._store.dispatch(push(Consts.LOGIN_PAGE_PATH));
    }

    handleLicenseError(errorCode) {
        if (errorCode === Consts.NO_LICENSE_ERROR_CODE) {
            this._store.dispatch(showAppError('No active license'));
        } else if (errorCode === Consts.EXPIRED_LICENSE_ERROR_CODE) {
            this._store.dispatch(showAppError('License has expired'));
        }
    }

    static create(store) {
        singleton = new Interceptor(store);
    }

    static getInterceptor() {
        return singleton;
    }
}
