// @ts-nocheck File not migrated fully to TS
/**
 * Created by jakub.niezgoda on 20/03/2019.
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createStore } from 'redux';

import { setLicense } from 'actions/license';
import * as types from 'actions/types';
import licenseReducer from 'reducers/licenseReducer';
import licenses from '../resources/licenses';

describe('(Reducer) License', () => {
    const mockStore = configureMockStore([thunk]);

    describe('Set license action', () => {
        let store = null;

        it('active license triggers actions', () => {
            store = mockStore({});
            store.dispatch(setLicense(licenses.activePayingLicense));

            const actualActions = store.getActions();
            const setManagerLicenseAction = {
                type: types.SET_MANAGER_LICENSE,
                license: licenses.activePayingLicense
            };
            const expectedActions = [setManagerLicenseAction];

            expect(actualActions).toHaveLength(expectedActions.length);
            expect(actualActions).toEqual(expectedActions);
        });

        it('active license changes license state', () => {
            store = createStore(licenseReducer, {});
            store.dispatch(setLicense(licenses.activePayingLicense));

            const expectedLicenseState = {
                data: licenses.activePayingLicense,
                status: 'active_license'
            };

            expect(store.getState()).toEqual(expectedLicenseState);
        });

        it('expired license triggers actions', () => {
            store = mockStore({});
            store.dispatch(setLicense(licenses.expiredPayingLicense));

            const actualActions = store.getActions();
            const setManagerLicenseAction = {
                type: types.SET_MANAGER_LICENSE,
                license: licenses.expiredPayingLicense
            };
            const expectedActions = [setManagerLicenseAction];

            expect(actualActions).toHaveLength(expectedActions.length);
            expect(actualActions).toEqual(expectedActions);
        });

        it('expired license sets license state', () => {
            store = createStore(licenseReducer, {});
            store.dispatch(setLicense(licenses.expiredPayingLicense));

            const expectedLicenseState = {
                data: licenses.expiredPayingLicense,
                status: 'expired_license'
            };

            expect(store.getState()).toEqual(expectedLicenseState);
        });
    });
});
