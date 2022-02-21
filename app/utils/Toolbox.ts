/* eslint-disable class-methods-use-this */

import _ from 'lodash';
import 'proxy-polyfill';
import type { AnyAction, Store, Unsubscribe } from 'redux';

import { drillDownToPage } from '../actions/drilldownPage';
import { selectPageByName, selectHomePage, selectParentPage } from '../actions/pageMenu';

import EventBus from './EventBus';
import Context from './Context';
import Manager from './Manager';
import External from './External';
import Internal from './Internal';
import WidgetBackend from './WidgetBackend';
import type { ReduxState } from '../reducers';

class Toolbox implements Stage.Types.Toolbox {
    private readonly store: Store<ReduxState>;

    public readonly unsubscribe: Unsubscribe;

    private templates!: ReduxState['templates'];

    private manager!: Manager;

    private internal!: Internal;

    private context!: Context;

    constructor(store: Store<ReduxState>) {
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
        this.manager = new Manager(state.manager || {});
        this.internal = new Internal(state.manager || {});
        this.context = new Context(this.store);
    }

    drillDown: Stage.Types.Toolbox['drillDown'] = (widget, defaultTemplate, drilldownContext, drilldownPageName) => {
        this.store.dispatch(
            (drillDownToPage(
                widget,
                this.templates.pagesDef[defaultTemplate],
                drilldownContext,
                drilldownPageName
                // NOTE: redux's type do not handle thunks well
            ) as unknown) as AnyAction
        );
    };

    goToHomePage() {
        // NOTE: redux's type do not handle thunks well
        this.store.dispatch((selectHomePage() as unknown) as AnyAction);
    }

    goToParentPage() {
        // NOTE: redux's type do not handle thunks well
        this.store.dispatch((selectParentPage() as unknown) as AnyAction);
    }

    goToPage: Stage.Types.Toolbox['goToPage'] = (pageName, context) => {
        this.store.dispatch((selectPageByName(pageName, context) as unknown) as AnyAction);
    };

    getEventBus() {
        return EventBus;
    }

    getManager() {
        return this.manager;
    }

    getManagerState() {
        return _.get(this.store.getState(), 'manager', {});
    }

    getInternal() {
        return this.internal;
    }

    getWidgetBackend() {
        const state = this.store.getState();
        const widget = this.getWidget();
        return new WidgetBackend(_.get(widget, 'definition.id', ''), state.manager || {});
    }

    getExternal: Stage.Types.Toolbox['getExternal'] = basicAuth => {
        return new External(basicAuth);
    };

    // This is sometimes needed inorder to join a different manager (for cluster joining for example)
    getNewManager() {
        return new Manager(undefined);
    }

    getContext() {
        return this.context;
    }

    // NOTE: placeholder methods. Real ones are proxied and provided when
    // the Toolbox instance is created
    refresh() {}

    loading() {}

    getWidget() {
        // NOTE: `getWidget` is dynamically substituted via Proxy
        return undefined as any;
    }
}

let toolbox: Toolbox | null = null;

const createToolbox = (store: Store<ReduxState>) => {
    toolbox = new Toolbox(store);
};

const getToolbox = (
    onRefresh: Stage.Types.Toolbox['refresh'],
    onLoading: Stage.Types.Toolbox['loading'],
    widget: ReturnType<Stage.Types.Toolbox['getWidget']>
) => {
    // NOTE: assumes the toolbox is already created
    return new Proxy(toolbox!, {
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
            return (target as any)[name];
        }
    });
};

export { createToolbox, getToolbox };
