/**
 * Created by kinneretzin on 18/10/2016.
 */

export default class EventBus {
    static events = {};

    static on (event, callback, context) {
        this.events.hasOwnProperty(event) || (this.events[event] = []);
        this.events[event].push([callback, context]);
    }

    static trigger (event) {
        var tail = Array.prototype.slice.call(arguments, 1);
        var callbacks = this.events[event];
        if (callbacks) {
            _.each(callbacks,(callback)=>{
                var currCallback = callback[0];
                var context = callback[1] === undefined ? this : callback[1];
                currCallback.apply(context, tail);
            });
        }
    }

    static off (event,offCallback) {
        var callbacks = this.events[event];
        if (callbacks) {
            _.remove(callbacks,(callback)=>{
                return (callback[0] === offCallback);
            });
        }
    }
};
