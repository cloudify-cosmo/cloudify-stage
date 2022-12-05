import { debounce, get, isEqual } from 'lodash';
import log from 'loglevel';
import type { Unsubscribe } from 'redux';
import { saveUserAppData } from '../actions/userApp';
import type { ReduxStore } from '../configureStore';
import type { ReduxState } from '../reducers';
import type { AuthData } from '../reducers/managerReducer/authReducer';

const autoSaverWaitInterval = 1000;
let singleton: UserAppDataAutoSaver | null = null;

export default class UserAppDataAutoSaver {
    isActive: boolean;

    unsubscribe: Unsubscribe;

    pages?: ReduxState['pages'];

    username?: AuthData['username'];

    role?: AuthData['role'];

    constructor(private store: ReduxStore) {
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

    static create(store: ReduxStore) {
        singleton = new UserAppDataAutoSaver(store);
    }

    static getAutoSaver() {
        return singleton;
    }
}
