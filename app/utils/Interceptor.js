/**
 * Created by edenp on 08/11/2017.
 */

import {unauthorized} from '../actions/auth';
var singleton = null;

export default class Interceptor {
    constructor (store) {
        this._store = store;
    }

    handle401(){
        this._store.dispatch(unauthorized('Unauthorized - Invalid Credentials'));
    }

    static create(store){
        singleton = new Interceptor(store);
    }
    static getInterceptor() {
        return singleton;
    }
}
