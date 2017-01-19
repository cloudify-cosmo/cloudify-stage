/**
 * Created by kinneretzin on 14/11/2016.
 */

import 'proxy-polyfill';

import {drillDownToPage} from '../actions/widgets';

import EventBus from './EventBus';
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
        this.widgetDefinitions = state.widgetDefinitions || [];
    }

    drillDown(widget,defaultTemplate,drilldownContext,drilldownPageName) {
        this.store.dispatch(drillDownToPage(widget,this.templates[defaultTemplate],this.widgetDefinitions,drilldownContext,drilldownPageName));
    }

    getEventBus (){
        return EventBus;
    }

    getManager() {
        return this._Manager;
    }

    getContext() {
        return this._Context;
    }

    refresh() {}

    loading(show) {}
}

var toolbox = null;

let createToolbox = (store) =>{
    toolbox = new Toolbox(store);
};

let getToolbox  = (onRefresh, onLoading)=>{
    return new Proxy(toolbox,{
        get: (target, name)=> {
            if (name === 'refresh') {
                return onRefresh;
            } else if (name === 'loading') {
                return onLoading;
            } else {
                return target[name];
            }
        }
    });
};

export {createToolbox,getToolbox};