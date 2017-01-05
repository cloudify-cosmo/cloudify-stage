/**
 * Created by kinneretzin on 14/11/2016.
 */

import {setValue as setContextValue} from '../actions/context';

export default class Context {
    constructor (store) {
        this.store = store;
        this.context = store.getState().context;
    }

    setValue(key,value) {
        this.store.dispatch(setContextValue(key,value));
    }
    getValue(key) {
        return this.context[key];
    }
}