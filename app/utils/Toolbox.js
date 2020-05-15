/**
 * Created by kinneretzin on 14/11/2016.
 */

import 'proxy-polyfill';

import { drillDownToPage } from '../actions/drilldownPage';
import { selectPageByName, selectHomePage, selectParentPage } from '../actions/page';

import EventBus from './EventBus';
import Context from './Context';
import Manager from './Manager';
import External from './External';
import Internal from './Internal';
import WidgetBackend from './WidgetBackend';

class Toolbox {
    constructor(store) {
        // Save the link to the store on the context (so we can dispatch to it later)
        this.store = store;
        this.initFromStore();

        // Subscribe to store change
        this.unsubscribe = store.subscribe(() => {
            this.initFromStore();
        });
    }

    initFromStore() {
        const state = this.store.getState();
        this.templates = state.templates || { templatesDef: {} };
        this._Manager = new Manager(state.manager || {});
        this._Internal = new Internal(state.manager || {});
        this._Context = new Context(this.store);
        this.widgetDefinitions = state.widgetDefinitions || [];
    }

    drillDown(widget, defaultTemplate, drilldownContext, drilldownPageName) {
        this.store.dispatch(
            drillDownToPage(
                widget,
                this.templates.pagesDef[defaultTemplate],
                this.widgetDefinitions,
                drilldownContext,
                drilldownPageName
            )
        );
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

    getEventBus() {
        return EventBus;
    }

    getManager() {
        return this._Manager;
    }

    getInternal() {
        return this._Internal;
    }

    getWidgetBackend() {
        const state = this.store.getState();
        const widget = this.getWidget();
        return new WidgetBackend(_.get(widget, 'definition.id', ''), state.manager || {});
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

    refresh() {}

    loading(show) {}

    getWidget() {}
}

let toolbox = null;

const createToolbox = store => {
    toolbox = new Toolbox(store);
};

const getToolbox = (onRefresh, onLoading, widget) => {
    return new Proxy(toolbox, {
        get: (target, name) => {
            if (name === 'refresh') {
                return onRefresh;
            }
            if (name === 'loading') {
                return onLoading;
            }
            if (name === 'getWidget') {
                return () => widget;
            }
            return target[name];
        }
    });
};

export { createToolbox, getToolbox };
