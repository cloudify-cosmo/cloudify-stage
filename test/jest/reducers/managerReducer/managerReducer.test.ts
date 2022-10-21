import configureMockStore from 'redux-mock-store';
import type { MockStore } from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import timeKeeper from 'timekeeper';
import { applyMiddleware, createStore } from 'redux';
import type { Reducer } from 'redux';

import { getManagerData, login, logout } from 'actions/managers';
import { ActionType } from 'actions/types';
import type { ManagerData } from 'reducers/managerReducer';
import managerReducer, { emptyState } from 'reducers/managerReducer';
import licenseReducer from 'reducers/managerReducer/licenseReducer';
import rbac from '../../resources/rbac';
import versions from '../../resources/versions';
import licenses from '../../resources/licenses';

describe('(Reducer) Manager', () => {
    const mockStore = configureMockStore([thunk]);
    const createStoreAsMockStore = (reducer: Reducer) => <MockStore>createStore(reducer, {}, applyMiddleware(thunk));
    const mockDate = new Date(2019, 4, 6);

    const username = 'admin';
    const password = 'admin';
    const sysAdminRole = 'sys_admin';

    let store: MockStore;

    beforeAll(() => {
        timeKeeper.freeze(mockDate);
    });

    afterAll(() => {
        timeKeeper.reset();
    });

    afterEach(() => {
        fetchMock.restore();
    });

    describe('Receive login action', () => {
        describe('when successful', () => {
            const role = sysAdminRole;
            beforeEach(() => {
                fetchMock.post('/console/auth/login', {
                    body: { role },
                    headers: { 'content-type': 'application/json' }
                });
            });

            it('triggers actions', () => {
                store = mockStore({});

                return store.dispatch(login(username, password)).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        { type: ActionType.REQ_LOGIN },
                        { type: ActionType.RES_LOGIN, username, role, receivedAt: Date.now() },
                        {
                            type: '@@router/CALL_HISTORY_METHOD',
                            payload: { args: ['/'], method: 'push' }
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('initializes state', () => {
                store = createStoreAsMockStore(managerReducer);

                return store.dispatch(login(username, password)).then(() => {
                    expect(store.getState()).toEqual({
                        ...emptyState,
                        auth: {
                            ...emptyState.auth,
                            username,
                            role,
                            state: 'loggedIn'
                        },
                        lastUpdated: Date.now()
                    } as ManagerData);
                });
            });
        });

        describe('when failed', () => {
            beforeEach(() => {
                fetchMock.post('/console/auth/login', {
                    body: {
                        message: 'User unauthorized'
                    },
                    headers: { 'content-type': 'application/json' },
                    status: 401
                });
            });

            it('triggers actions', () => {
                store = mockStore({});

                return store.dispatch(login(username, password)).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        { type: ActionType.REQ_LOGIN },
                        {
                            type: ActionType.ERR_LOGIN,
                            username,
                            error: { code: undefined, message: 'User unauthorized', status: 401 },
                            receivedAt: Date.now()
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('sets error state', () => {
                store = createStoreAsMockStore(managerReducer);

                return store.dispatch(login(username, password)).then(() => {
                    expect(store.getState()).toEqual({
                        ...emptyState,
                        auth: {
                            ...emptyState.auth,
                            username,
                            error: 'User unauthorized'
                        },
                        lastUpdated: Date.now()
                    });
                });
            });
        });
    });

    describe('Receive logout action', () => {
        beforeEach(() => {
            fetchMock.post('/console/auth/logout', {
                body: {},
                headers: { 'content-type': 'application/json' }
            });
        });

        it('triggers actions', () => {
            store = mockStore({});

            return store.dispatch(logout('License expired')).then(() => {
                const actualActions = store.getActions();
                const expectedActions = [
                    { type: ActionType.CLEAR_CONTEXT },
                    { type: ActionType.LOGOUT, error: 'License expired', receivedAt: Date.now() },
                    {
                        type: '@@router/CALL_HISTORY_METHOD',
                        payload: { args: ['/error'], method: 'push' }
                    }
                ];

                expect(actualActions).toEqual(expectedActions);
            });
        });

        it('resets state', () => {
            store = createStoreAsMockStore(managerReducer);

            return store.dispatch(logout('License expired')).then(() => {
                expect(store.getState()).toEqual({
                    ...emptyState,
                    lastUpdated: Date.now()
                });
            });
        });
    });

    describe('Receive get manager data action', () => {
        describe('empty license', () => {
            beforeEach(() => {
                fetchMock.get('/console/auth/manager', {
                    body: {
                        license: {},
                        version: versions.premium,
                        rbac
                    },
                    headers: { 'content-type': 'application/json' }
                });
            });

            it('triggers actions', () => {
                store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            version: versions.premium
                        },
                        { type: ActionType.SET_LICENSE_REQUIRED, isRequired: true },
                        { type: ActionType.SET_MANAGER_LICENSE, license: {} },
                        {
                            type: ActionType.STORE_RBAC,
                            roles: rbac.roles,
                            permissions: rbac.permissions
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('changes license state', () => {
                store = createStoreAsMockStore(licenseReducer);

                const expectedLicenseState = {
                    data: {},
                    isRequired: true,
                    status: 'no_license'
                };

                return store.dispatch(getManagerData()).then(() => {
                    expect(store.getState()).toEqual(expectedLicenseState);
                });
            });
        });

        describe('active license', () => {
            beforeEach(() => {
                fetchMock.get('/console/auth/manager', {
                    body: {
                        license: licenses.activePayingLicense,
                        version: versions.premium,
                        rbac
                    },
                    headers: { 'content-type': 'application/json' }
                });
            });

            it('triggers actions', () => {
                store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            version: versions.premium
                        },
                        {
                            type: ActionType.SET_LICENSE_REQUIRED,
                            isRequired: true
                        },
                        {
                            type: ActionType.SET_MANAGER_LICENSE,
                            license: licenses.activePayingLicense
                        },
                        {
                            type: ActionType.STORE_RBAC,
                            roles: rbac.roles,
                            permissions: rbac.permissions
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('changes license state', () => {
                store = createStoreAsMockStore(licenseReducer);

                const expectedLicenseState = {
                    data: { ...licenses.activePayingLicense },
                    isRequired: true,
                    status: 'active_license'
                };

                return store.dispatch(getManagerData()).then(() => {
                    expect(store.getState()).toEqual(expectedLicenseState);
                });
            });
        });

        describe('expired license', () => {
            beforeEach(() => {
                fetchMock.get('/console/auth/manager', {
                    body: {
                        license: licenses.expiredPayingLicense,
                        version: versions.premium,
                        rbac
                    },
                    headers: { 'content-type': 'application/json' }
                });
            });

            it('triggers actions', () => {
                store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            version: versions.premium
                        },
                        {
                            type: ActionType.SET_LICENSE_REQUIRED,
                            isRequired: true
                        },
                        {
                            type: ActionType.SET_MANAGER_LICENSE,
                            license: licenses.expiredPayingLicense
                        },
                        {
                            type: ActionType.STORE_RBAC,
                            roles: rbac.roles,
                            permissions: rbac.permissions
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('changes license state', () => {
                store = createStoreAsMockStore(licenseReducer);

                const expectedLicenseState = {
                    data: licenses.expiredPayingLicense,
                    isRequired: true,
                    status: 'expired_license'
                };

                return store.dispatch(getManagerData()).then(() => {
                    expect(store.getState()).toEqual(expectedLicenseState);
                });
            });
        });

        describe('non-licensed version', () => {
            beforeEach(() => {
                fetchMock.get('/console/auth/manager', {
                    body: {
                        license: null,
                        version: versions.community,
                        rbac
                    },
                    headers: { 'content-type': 'application/json' }
                });
            });

            it('non-licensed version triggers actions', () => {
                store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            version: versions.community
                        },
                        { type: ActionType.SET_LICENSE_REQUIRED, isRequired: false },
                        { type: ActionType.SET_MANAGER_LICENSE, license: null },
                        {
                            type: ActionType.STORE_RBAC,
                            roles: rbac.roles,
                            permissions: rbac.permissions
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('non-licensed version changes license state', () => {
                store = createStoreAsMockStore(licenseReducer);

                const expectedLicenseState = {
                    data: null,
                    isRequired: false,
                    status: 'no_license'
                };

                return store.dispatch(getManagerData()).then(() => {
                    expect(store.getState()).toEqual(expectedLicenseState);
                });
            });
        });
    });
});
