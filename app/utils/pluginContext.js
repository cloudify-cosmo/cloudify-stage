/**
 * Created by kinneretzin on 11/09/2016.
 */


export default class Context {
    constructor(setContextValue,contextData) {
        this._setValue = setContextValue;
        this._data = contextData;

    }
    setValue(key,value) {
        this._setValue(key,value);
    }
    getValue(key) {
        return this._data[key];
    }
}
