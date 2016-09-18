/**
 * Created by kinneretzin on 11/09/2016.
 */


export default class Context {
    constructor(setContextValue,contextData,onDrilldownToPage,templates) {
        this._setValue = setContextValue;
        this._data = contextData;

        this._onDrilldowToPage = onDrilldownToPage;
        this._templates = templates;
    }
    setValue(key,value) {
        this._setValue(key,value);
    }
    getValue(key) {
        return this._data[key];
    }

    drillDown(widget,defaultTemplate) {
        this._onDrilldowToPage(widget,this._templates[defaultTemplate]);
    }

}

