/**
 * Created by kinneretzin on 11/09/2016.
 */

import config from '../config.json';
import StageUtils from '../utils/stageUtils';

export default class Context {
    constructor(setContextValue,contextData,onDrilldownToPage,onRefresh,templates,manager,eventBus) {
        this._setValue = setContextValue;
        this._data = contextData;

        this._onDrilldowToPage = onDrilldownToPage;
        this._onRefresh = onRefresh;
        this._templates = templates;
        this._manager = manager;
        this._eventBus = eventBus;
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

    getManagerUrl(queryString) {
        return StageUtils.createManagerUrl(config.proxyIp, this._manager.ip, queryString);
    }

    getSecurityHeaders() {
        var auth = this._manager.auth;
        return (auth.isSecured && auth.token ? {"Authentication-Token": auth.token} : undefined);
    }

    refresh() {
        this._onRefresh();
    }

    getEventBus (){
        return this._eventBus;
    }

}

