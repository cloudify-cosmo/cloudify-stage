import { MiddlewareAPI } from 'redux';
import { setValue as setContextValue } from '../actions/context';

/** @see https://docs.cloudify.co/developer/writing_widgets/widget-apis/#getcontext */
export default class Context {
    private readonly store: MiddlewareAPI;

    // NOTE: this is not a React component, so this rule does not apply
    // eslint-disable-next-line react/static-property-placement
    private readonly context: any;

    constructor(store: MiddlewareAPI) {
        this.store = store;
        this.context = store.getState().context;
    }

    /**
     * Sets value in the context.
     *
     * Keep in mind that `setValue` works like `setState` in React class components.
     * This means that calling `getValue` after calling `setState` will keep yielding the value
     * from before `setState` until the widget rerenders.
     */
    public setValue(key: any, value: any) {
        this.store.dispatch(setContextValue(key, value));
    }

    public getValue(key: any) {
        return this.context[key];
    }
}
