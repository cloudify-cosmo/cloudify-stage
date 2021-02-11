import { MiddlewareAPI } from 'redux';
import { setValue as setContextValue } from '../actions/context';

/** @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#getcontext */
export default class Context {
    private store: MiddlewareAPI;

    // NOTE: this is not a React component, so this rule does not apply
    // eslint-disable-next-line react/static-property-placement
    private context: any;

    constructor(store: MiddlewareAPI) {
        this.store = store;
        this.context = store.getState().context;
    }

    public setValue(key: any, value: any) {
        this.store.dispatch(setContextValue(key, value));
        // NOTE: should we not set this.context[key] = value too?
    }

    public getValue(key: any) {
        return this.context[key];
    }
}
