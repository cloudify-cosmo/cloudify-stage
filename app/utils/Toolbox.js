/**
 * Created by kinneretzin on 14/11/2016.
 */

import 'proxy-polyfill';

import {drillDownToPage} from '../actions/widgets';
import {selectPageByName, selectHomePage, selectParentPage} from '../actions/page';


import EventBus from './EventBus';
import Context from './Context';
import Manager from './Manager';
import External from './External';
import Internal from './Internal';
import WidgetBackend from './WidgetBackend';

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
        this.templates = state.templates || {templatesDef: {}};
        this._Manager = new Manager(state.manager || {});
        this._Internal = new Internal(state.manager || {});
        this._Context = new Context(this.store);
        this.widgetDefinitions = state.widgetDefinitions || [];
        this._widgetsConfig = state.config.widgets;
    }

    drillDown(widget,defaultTemplate,drilldownContext,drilldownPageName) {
        this.store.dispatch(drillDownToPage(widget,this.templates.pagesDef[defaultTemplate],this.widgetDefinitions,drilldownContext,drilldownPageName));
    }

    goToHomePage() {
        this.store.dispatch(selectHomePage());
    }

    goToParentPage() {
        this.store.dispatch(selectParentPage());
    }

    goToPage(pageName) {
        this.store.dispatch(selectPageByName(pageName));
    }

    getEventBus (){
        return EventBus;
    }

    getManager() {
        return this._Manager;
    }

    getInternal() {
        return this._Internal;
    }

    getWidgetBackend() {
        var state = this.store.getState();
        return new WidgetBackend(this.getWidgetDefinitionId(), state.manager || {});
    }

    getExternal(basicAuth) {
        return new External(basicAuth);
    }

    // This is sometimes needed inorder to join a different manager (for cluster joining for example)
    getNewManager() {
        return new Manager();
    }

    getContext() {
        return this._Context;
    }

    getConfig() {
        return this._widgetsConfig;
    }

    refresh() {}

    loading(show) {}

    getWidgetDefinitionId() {}
}

var toolbox = null;

let createToolbox = (store) =>{
    toolbox = new Toolbox(store);
};

let getToolbox = (onRefresh, onLoading, widgetDefinitionId)=>{
    return new Proxy(toolbox,{
        get: (target, name)=> {
            if (name === 'refresh') {
                return onRefresh;
            } else if (name === 'loading') {
                return onLoading;
            } else if (name === 'getWidgetDefinitionId') {
                return () => widgetDefinitionId;
            } else {
                return target[name];
            }
        }
    });
};

export {createToolbox,getToolbox};