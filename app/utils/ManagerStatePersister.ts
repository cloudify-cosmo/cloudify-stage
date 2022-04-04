import log from 'loglevel';

import { emptyState } from '../reducers/managerReducer';
import type { ReduxState } from '../reducers';
import type { ManagerData } from '../reducers/managerReducer';

export default class ManagerStatePersister {
    public static save(managerState: ManagerData, mode: string) {
        try {
            const serializedManagerState = JSON.stringify(managerState);
            localStorage.setItem(getStorageKey(mode), serializedManagerState);
        } catch (e) {
            log.error('Error when saving manager state', e);
        }
    }

    public static load(mode: string): ManagerData {
        try {
            const managerState =
                this.loadManagerStateDirectly(mode) ?? this.loadWrappedManagerState(mode) ?? emptyState;

            // Clear login error if has any
            managerState.auth.error = null;

            return managerState;
        } catch (e) {
            log.error('Error when loading manager state', e);
            return emptyState;
        }
    }

    private static loadManagerStateDirectly(mode: string): ManagerData | undefined {
        const serializedState = localStorage.getItem(getStorageKey(mode));
        if (serializedState === null) {
            return undefined;
        }

        return JSON.parse(serializedState);
    }

    /**
     * @deprecated
     */
    private static loadWrappedManagerState(mode: string): ManagerData | undefined {
        const storageKey = getDeprecatedStorageKey(mode);

        const serializedState = localStorage.getItem(storageKey);
        if (serializedState === null) {
            return undefined;
        }

        const state: Pick<ReduxState, 'manager'> = JSON.parse(serializedState);
        const managerState = state.manager;

        this.save(managerState, mode);
        localStorage.removeItem(storageKey);

        return managerState;
    }
}

const getStorageKey = (mode: string) => `manager-state-${mode}`;
const getDeprecatedStorageKey = (mode: string) => `state-${mode}`;
