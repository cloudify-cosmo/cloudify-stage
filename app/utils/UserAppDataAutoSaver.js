/**
 * Created by kinneretzin on 09/02/2017.
 */

import { saveUserAppData } from '../actions/userAppCommon';

let singleton = null;

export default class UserAppDataAutoSaver {
    constructor(store) {
        this._store = store;
        this._isActive = false;

        this.initFromStore();

        // Subscribe to store change
        this.unsubscribe = store.subscribe(() => {
            const state = this._store.getState();

            if (this._isActive && this.hasDataChanged(state) && this.validData(state)) {
                this.initFromStore();

                this._store.dispatch(saveUserAppData());
            }
        });
    }

    initFromStore() {
        const state = this._store.getState();
        this._pages = state.pages;
        this._username = _.get(state, 'manager.username');
        this._role = _.get(state, 'manager.auth.role');
    }

    validData(state) {
        return _.get(state, 'manager.username') && _.get(state, 'manager.auth.role');
    }

    hasDataChanged(state) {
        return (
            this._username !== state.manager.username ||
            this._role !== state.manager.auth.role ||
            !_.isEqual(this._pages, state.pages)
        );
    }

    start() {
        if (!this._isActive) {
            console.log(`Starting UserAppDataAutoSaver for user ${this._username} role ${this._role}`);
            this._isActive = true;
        }
    }

    stop() {
        if (this._isActive) {
            console.log(`Stopping UserAppDataAutoSaver for user ${this._username} role ${this._role}`);

            this._isActive = false;
        }
    }

    static create(store) {
        singleton = new UserAppDataAutoSaver(store);
    }

    static getAutoSaver() {
        return singleton;
    }
}
