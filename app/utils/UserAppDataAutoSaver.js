/**
 * Created by kinneretzin on 09/02/2017.
 */

import _ from 'lodash';
import log from 'loglevel';
import { saveUserAppData } from '../actions/userAppCommon';

let singleton = null;

export default class UserAppDataAutoSaver {
    constructor(store) {
        this.store = store;
        this.isActive = false;

        this.initFromStore();

        // Subscribe to store change
        this.unsubscribe = store.subscribe(() => {
            if (this.isActive && this.hasDataChanged() && this.validData()) {
                this.initFromStore();

                this.store.dispatch(saveUserAppData());
            }
        });
    }

    initFromStore() {
        const state = this.store.getState();
        this.pages = state.pages;
        this.username = _.get(state, 'manager.username');
        this.role = _.get(state, 'manager.auth.role');
    }

    validData() {
        const state = this.store.getState();
        return _.get(state, 'manager.username') && _.get(state, 'manager.auth.role');
    }

    hasDataChanged() {
        const state = this.store.getState();
        return (
            this.username !== state.manager.username ||
            this.role !== state.manager.auth.role ||
            !_.isEqual(this.pages, state.pages)
        );
    }

    start() {
        if (!this.isActive) {
            log.log(`Starting UserAppDataAutoSaver for user ${this.username} role ${this.role}`);
            this.isActive = true;
        }
    }

    stop() {
        if (this.isActive) {
            log.log(`Stopping UserAppDataAutoSaver for user ${this.username} role ${this.role}`);

            this.isActive = false;
        }
    }

    static create(store) {
        singleton = new UserAppDataAutoSaver(store);
    }

    static getAutoSaver() {
        return singleton;
    }
}
