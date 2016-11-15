/**
 * Created by kinneretzin on 14/11/2016.
 */

import {setValue as setContextValue} from '../actions/context';
import config from '../config.json';
import CommonUtils from '../utils/commonUtils';
import PluginEventBus from '../utils/PluginEventBus';
import {drillDownToPage} from '../actions/widgets';

class Context {
    constructor (store) {
        // Save the link to the store on the context (so we can dispatch to it later)
        this.store = store;
        this._initFromStore();

        // Subscribe to store change
        this.unsubscribe = store.subscribe(() => {
            this._initFromStore();
        });
    }

    _initFromStore () {
        var state = this.store.getState();
        this.context = state.context;
        this.templates = state.templates.items || {};
        this.manager = _.get(state, "managers.items[0]", {});
    }

    setValue(key,value) {
        this.store.dispatch(setContextValue(key,value));
    }
    getValue(key) {
        return this.context[key];
    }

    drillDown(widget,defaultTemplate) {
        this.store.dispatch(drillDownToPage(widget,this.templates[defaultTemplate]));
    }

    getManagerUrl(queryString) {
        return CommonUtils.createManagerUrl(config.proxyIp, this.manager.ip, queryString);
    }

    getSecurityHeaders() {
        var auth = this.manager.auth;
        return (auth.isSecured && auth.token ? {"Authentication-Token": auth.token} : undefined);
    }

    getEventBus (){
        return PluginEventBus;
    }
    refresh () {}
}

var context = null;

let createContext = (store) =>{
    context = new Context(store);
};

let getContext  = (onRefresh)=>{
    return new Proxy(context,{
        get: (target, name)=> {
            if (name === 'refresh') {
                return onRefresh;
            } else {
                return target[name];
            }
        }
    });
};

export {createContext,getContext};