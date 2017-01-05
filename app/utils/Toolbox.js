/**
 * Created by kinneretzin on 14/11/2016.
 */

import 'proxy-polyfill';

import {drillDownToPage} from '../actions/widgets';

import PluginEventBus from './PluginEventBus';
import Context from './Context';
import Manager from './Manager';

class Toolbox {
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
        this.templates = state.templates || {};
        this._Manager = new Manager(state.manager || {});
        this._Context = new Context(this.store);
        this.plugins = state.plugins || [];
    }

    drillDown(widget,defaultTemplate) {
        this.store.dispatch(drillDownToPage(widget,this.templates[defaultTemplate],this.plugins));
    }

    getEventBus (){
        return PluginEventBus;
    }

    getManager() {
        return this._Manager;
    }

    getContext() {
        return this._Context;
    }

    refresh () {}
}

var toolbox = null;

let createToolbox = (store) =>{
    toolbox = new Toolbox(store);
};

let getToolbox  = (onRefresh)=>{
    return new Proxy(toolbox,{
        get: (target, name)=> {
            if (name === 'refresh') {
                return onRefresh;
            } else {
                return target[name];
            }
        }
    });
};

export {createToolbox,getToolbox};