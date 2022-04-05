import log from 'loglevel';

import { emptyState } from 'reducers/managerReducer';
import type { ManagerData } from 'reducers/managerReducer';
import ManagerStatePersister from 'utils/ManagerStatePersister';

describe('(Utils) ManagerStatePersister', () => {
    const mainMode = 'main';
    const errorSpy = jest.spyOn(log, 'error');

    beforeEach(() => {
        localStorage.clear();
        jest.resetAllMocks();
    });

    it('should return empty manager state when there is none in the store', () => {
        const managerState = ManagerStatePersister.load(mainMode);

        expect(managerState).toEqual(emptyState);
    });

    it('should return the previously saved manager state', () => {
        const managerState: ManagerData = {
            ...emptyState,
            lastUpdated: 1234
        };

        ManagerStatePersister.save(managerState, mainMode);

        expect(ManagerStatePersister.load(mainMode)).toEqual(managerState);
    });

    it('should handle storing different modes separately', () => {
        const alternateMode = 'alternate';

        const alternateModeManagerState: ManagerData = {
            ...emptyState,
            lastUpdated: 1234
        };

        ManagerStatePersister.save(alternateModeManagerState, alternateMode);

        expect(ManagerStatePersister.load(mainMode)).toEqual(emptyState);
        expect(ManagerStatePersister.load(alternateMode)).toEqual(alternateModeManagerState);
    });

    it('should log an error when serializing state failed', () => {
        localStorage.setItem(`manager-state-${mainMode}`, 'some invalid { json }');

        expect(ManagerStatePersister.load(mainMode)).toEqual(emptyState);
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('should log an error when serializing state failed (for deprecated state)', () => {
        localStorage.setItem(`state-${mainMode}`, 'some invalid { json }');

        expect(ManagerStatePersister.load(mainMode)).toEqual(emptyState);
        expect(errorSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle migration from storing manager state wrapped in an object', () => {
        const managerState: ManagerData = {
            ...emptyState,
            lastUpdated: 1234
        };

        localStorage.setItem(`state-${mainMode}`, JSON.stringify({ manager: managerState }));

        const loadedManagerState = ManagerStatePersister.load(mainMode);

        expect(loadedManagerState).toEqual(managerState);
    });

    it('should migrate the state to the new format immediately', () => {
        const managerState: ManagerData = {
            ...emptyState,
            lastUpdated: 1234
        };

        const storageKey = `state-${mainMode}`;
        localStorage.setItem(storageKey, JSON.stringify({ manager: managerState }));

        ManagerStatePersister.load(mainMode);
        localStorage.removeItem(storageKey);

        // NOTE: simulate refreshing the browser immediately and needing to load the state again
        const loadedManagerState = ManagerStatePersister.load(mainMode);

        expect(loadedManagerState).toEqual(managerState);
    });
});
