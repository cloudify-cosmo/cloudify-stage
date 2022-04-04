// @ts-nocheck File not migrated fully to TS
import { debounce, get, isEqual } from 'lodash';
import log from 'loglevel';
import { saveUserAppData } from '../actions/userAppCommon';

const autoSaverWaitInterval = 1000;
let singleton = null;

export default class UserAppDataAutoSaver {
    constructor(store) {
        this.store = store;
        this.isActive = false;

        this.initFromStore();

        // Subscribe to store change
        this.unsubscribe = store.subscribe(
            debounce(() => {
                if (this.isActive && this.hasDataChanged() && this.validData()) {
                    this.initFromStore();

                    this.store.dispatch(saveUserAppData());
                }
            }, autoSaverWaitInterval)
        );
    }

    initFromStore() {
        const state = this.store.getState();
        this.pages = state.pages;
        this.username = get(state, 'manager.auth.username');
        this.role = get(state, 'manager.auth.role');
    }

    validData() {
        const state = this.store.getState();
        return get(state, 'manager.auth.username') && get(state, 'manager.auth.role');
    }

    hasDataChanged() {
        const state = this.store.getState();
        return (
            this.username !== state.manager.auth.username ||
            this.role !== state.manager.auth.role ||
            !isEqual(this.pages, state.pages)
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
