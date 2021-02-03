/**
 * Created by kinneretzin on 18/10/2016.
 */

import _ from 'lodash';

type Callback = (...args: any[]) => void;

export default class EventBus {
    private static events: Record<string, [Callback, any][]> = {};

    public static on(event: string, callback: Callback, context?: any) {
        this.events[event] = this.events[event] || [];
        this.events[event].push([callback, context]);
    }

    public static trigger(event: string, ...args: any[]) {
        const callbacks = this.events[event];
        if (callbacks) {
            _.each(callbacks, callback => {
                const currCallback = callback[0];
                const context = callback[1] === undefined ? this : callback[1];
                currCallback.apply(context, args);
            });
        }
    }

    public static off(event: string, offCallback: Callback) {
        const callbacks = this.events[event];
        if (callbacks) {
            _.remove(callbacks, callback => {
                return callback[0] === offCallback;
            });
        }
    }
}
