/**
 * Created by jakub.niezgoda on 20/03/2019.
 */

import {expect} from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import timeKeeper from 'timekeeper';
import {applyMiddleware, createStore} from 'redux';

import licenses from '../resources/licenses';
import versions from '../resources/versions';

import {login} from '../../app/actions/managers';
import {setLicense} from '../../app/actions/license';
import * as types from '../../app/actions/types.js';
import licenseReducer from '../../app/reducers/licenseReducer';


describe('(Reducer) License', () => {

    const mockStore = configureMockStore([ thunk ]);
    const mockDate = new Date(2019,4,6);

    const username = 'admin';
    const password = 'admin';
    const sysAdminRole = 'sys_admin';

    describe('Receive login action',() => {

        let store = null;

        before(() => {
            timeKeeper.freeze(mockDate);
        });

        after(() => {
            timeKeeper.reset();
        });

        afterEach(() => {
            fetchMock.restore();
        });

        it('empty license triggers actions', () => {
            store = mockStore({});
            fetchMock.post('/console/auth/login', {
                body: { license: [], version: versions.premium, role: sysAdminRole },
                headers: { 'content-type': 'application/json' }
            });

            return store.dispatch(login(username, password))
                .then(() => {
                    const actualActions = store.getActions();
                    const resLoginAction =
                        { type: types.RES_LOGIN, username, role: sysAdminRole, version: versions.premium, license: [],
                            licenseRequired: true, receivedAt: Date.now() };
                    const expectedActions = [
                        { type: types.REQ_LOGIN },
                        {...resLoginAction},
                        { type: '@@router/CALL_HISTORY_METHOD', payload: {args: ['/'], method: 'push'} }
                    ];

                    expect(actualActions).to.have.length(expectedActions.length);
                    expect(actualActions).to.eql(expectedActions);
                });
        });

        it('empty license changes license state', () => {
            store = createStore(licenseReducer,{}, applyMiddleware(thunk));
            fetchMock.post('/console/auth/login', {
                body: { license: [], version: versions.premium, role: sysAdminRole },
                headers: { 'content-type': 'application/json' }
            });

            const expectedLicenseState = {
                data: [],
                isRequired: true,
                status: 'no_license'
            };

            store.dispatch(login(username, password))
                .then(() => {
                    expect(store.getState()).to.eql(expectedLicenseState);
            });
        });

        it('active license triggers actions', () => {
            store = mockStore({});
            fetchMock.post('/console/auth/login', {
                    body: { license: licenses.activePayingLicense, version: versions.premium, role: sysAdminRole },
                    headers: { 'content-type': 'application/json' }
            });

            return store.dispatch(login(username, password))
                .then(() => {
                    const actualActions = store.getActions();
                    const resLoginAction =
                        { type: types.RES_LOGIN, username, role: sysAdminRole, version: versions.premium, license: licenses.activePayingLicense,
                          licenseRequired: true, receivedAt: Date.now() };
                    const expectedActions = [
                        { type: types.REQ_LOGIN },
                        {...resLoginAction},
                        { type: '@@router/CALL_HISTORY_METHOD', payload: {args: ['/'], method: 'push'} }
                    ];

                    expect(actualActions).to.have.length(expectedActions.length);
                    expect(actualActions).to.eql(expectedActions);
                });
        });

        it('active license changes license state', () => {
            store = createStore(licenseReducer,{}, applyMiddleware(thunk));
            fetchMock.post('/console/auth/login', {
                    body: { license: licenses.activePayingLicense, version: versions.premium, role: sysAdminRole },
                    headers: { 'content-type': 'application/json' }
            });

            const expectedLicenseState = {
                data: {...licenses.activePayingLicense},
                isRequired: true,
                status: 'active_license'
            };

            return store.dispatch(login(username, password))
                .then(() => {
                    expect(store.getState()).to.eql(expectedLicenseState);
                });
        });

        it('expired license triggers actions', () => {
            store = mockStore({});
            fetchMock.post('/console/auth/login', {
                body: { license: licenses.expiredPayingLicense, version: versions.premium, role: sysAdminRole },
                headers: { 'content-type': 'application/json' }
            });

            return store.dispatch(login(username, password))
                .then(() => {
                    const actualActions = store.getActions();
                    const resLoginAction =
                        { type: types.RES_LOGIN, username, role: sysAdminRole, version: versions.premium, license: licenses.expiredPayingLicense,
                            licenseRequired: true, receivedAt: Date.now() };
                    const expectedActions = [
                        { type: types.REQ_LOGIN },
                        {...resLoginAction},
                        { type: '@@router/CALL_HISTORY_METHOD', payload: {args: ['/'], method: 'push'} }
                    ];

                    expect(actualActions).to.have.length(expectedActions.length);
                    expect(actualActions).to.eql(expectedActions);
                });
        });

        it('expired license changes license state', () => {
            store = createStore(licenseReducer,{}, applyMiddleware(thunk));
            fetchMock.post('/console/auth/login', {
                body: { license: licenses.expiredPayingLicense, version: versions.premium, role: sysAdminRole },
                headers: { 'content-type': 'application/json' }
            });

            const expectedLicenseState = {
                data: licenses.expiredPayingLicense,
                isRequired: true,
                status: 'expired_license'
            };

            return store.dispatch(login(username, password))
                .then(() => {
                    expect(store.getState()).to.eql(expectedLicenseState);
                });
        });

        it('non-licensed version triggers actions', () => {
            store = mockStore({});
            fetchMock.post('/console/auth/login', {
                body: { license: null, version: versions.community, role: sysAdminRole },
                headers: { 'content-type': 'application/json' }
            });

            return store.dispatch(login(username, password))
                .then(() => {
                    const actualActions = store.getActions();
                    const resLoginAction =
                        { type: types.RES_LOGIN, username, role: sysAdminRole, version: versions.community, license: null,
                            licenseRequired: false, receivedAt: Date.now() };
                    const expectedActions = [
                        { type: types.REQ_LOGIN },
                        {...resLoginAction},
                        { type: '@@router/CALL_HISTORY_METHOD', payload: {args: ['/'], method: 'push'} }
                    ];

                    expect(actualActions).to.have.length(expectedActions.length);
                    expect(actualActions).to.eql(expectedActions);
                });
        });

        it('non-licensed version changes license state', () => {
            store = createStore(licenseReducer,{}, applyMiddleware(thunk));
            fetchMock.post('/console/auth/login', {
                body: { license: null, version: versions.community, role: sysAdminRole },
                headers: { 'content-type': 'application/json' }
            });

            const expectedLicenseState = {
                data: null,
                isRequired: false,
                status: 'no_license'
            };

            return store.dispatch(login(username, password))
                .then(() => {
                    expect(store.getState()).to.eql(expectedLicenseState);
                });
        });

    });

    describe('Set license action',() => {

        let store = null;

        it('active license triggers actions', () => {
            store = mockStore({});
            store.dispatch(setLicense(licenses.activePayingLicense));

            const actualActions = store.getActions();
            const setManagerLicenseAction =
                { type: types.SET_MANAGER_LICENSE, license: licenses.activePayingLicense };
            const expectedActions = [
                setManagerLicenseAction
            ];

            expect(actualActions).to.have.length(expectedActions.length);
            expect(actualActions).to.eql(expectedActions);
        });

        it('active license changes license state', () => {
            store = createStore(licenseReducer,{});
            store.dispatch(setLicense(licenses.activePayingLicense));

            const expectedLicenseState = {
                data: licenses.activePayingLicense,
                status: 'active_license'
            };

            expect(store.getState()).to.eql(expectedLicenseState);
        });

        it('expired license triggers actions', () => {
            store = mockStore({});
            store.dispatch(setLicense(licenses.expiredPayingLicense));

            const actualActions = store.getActions();
            const setManagerLicenseAction =
                { type: types.SET_MANAGER_LICENSE, license: licenses.expiredPayingLicense };
            const expectedActions = [
                setManagerLicenseAction
            ];

            expect(actualActions).to.have.length(expectedActions.length);
            expect(actualActions).to.eql(expectedActions);
        });

        it('expired license sets license state', () => {
            store = createStore(licenseReducer,{});
            store.dispatch(setLicense(licenses.expiredPayingLicense));

            const expectedLicenseState = {
                data: licenses.expiredPayingLicense,
                status: 'expired_license'
            };

            expect(store.getState()).to.eql(expectedLicenseState);
        });

    });

});
