import _ from 'lodash';
import type { Callback, EventBus } from 'cloudify-ui-components';

const events: Record<string, [Callback, any][]> = {};

const eventBus: EventBus = {
    on(event, callback, context) {
        events[event] = events[event] || [];
        events[event].push([callback, context]);
    },

    trigger(event, ...args) {
        const callbacks = events[event];
        if (callbacks) {
            _.each(callbacks, callback => {
                const currCallback = callback[0];
                const context = callback[1] === undefined ? this : callback[1];
                currCallback.apply(context, args);
            });
        }
        return eventBus;
    },

    off(event, offCallback) {
        const callbacks = events[event];
        if (callbacks) {
            _.remove(callbacks, callback => {
                return callback[0] === offCallback;
            });
        }
    }
};

export default eventBus;
