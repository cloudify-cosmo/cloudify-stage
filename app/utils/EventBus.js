/**
 * Created by kinneretzin on 18/10/2016.
 */

export default class EventBus {
    static events = {};

    static on(event, callback, context) {
        this.events.hasOwnProperty(event) || (this.events[event] = []);
        this.events[event].push([callback, context]);
    }

    static trigger(event, ...args) {
        const callbacks = this.events[event];
        if (callbacks) {
            _.each(callbacks, callback => {
                const currCallback = callback[0];
                const context = callback[1] === undefined ? this : callback[1];
                currCallback.apply(context, args);
            });
        }
    }

    static off(event, offCallback) {
        const callbacks = this.events[event];
        if (callbacks) {
            _.remove(callbacks, callback => {
                return callback[0] === offCallback;
            });
        }
    }
}
