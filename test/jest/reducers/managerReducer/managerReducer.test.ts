import configureMockStore from 'redux-mock-store';
import type { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import timeKeeper from 'timekeeper';
import { applyMiddleware, createStore } from 'redux';
import type { Reducer } from 'redux';

import { getManagerData, login, logout } from 'actions/manager/auth';
import { ActionType } from 'actions/types';
import type { ManagerData } from 'reducers/managerReducer';
import managerReducer, { emptyState } from 'reducers/managerReducer';
import licenseReducer from 'reducers/managerReducer/licenseReducer';
import type { ReduxState } from 'reducers';
import type { ReduxThunkDispatch } from 'configureStore';
import rbac from '../../resources/rbac';
import versions from '../../resources/versions';
import licenses from '../../resources/licenses';

describe('(Reducer) Manager', () => {
    const mockStore = configureMockStore<Partial<ReduxState>, ReduxThunkDispatch>([thunk]);
    const createStoreAsMockStore = (reducer: Reducer) =>
        <MockStoreEnhanced<Partial<ReduxState>, ReduxThunkDispatch>>createStore(reducer, {}, applyMiddleware(thunk));
    const mockDate = new Date(2019, 4, 6);

    const username = 'admin';
    const password = 'admin';
    const sysAdminRole = 'sys_admin';

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
                const store = mockStore({});

                return store.dispatch(login(username, password)).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        { type: ActionType.LOGIN_REQUEST },
                        { type: ActionType.LOGIN_SUCCESS, payload: { username, role, receivedAt: Date.now() } },
                        {
                            type: '@@router/CALL_HISTORY_METHOD',
                            payload: { args: ['/'], method: 'push' }
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('initializes state', () => {
                const store = createStoreAsMockStore(managerReducer);

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
            const expectedError = { code: undefined, message: 'User unauthorized', status: 401 };

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
                const store = mockStore({});

                return store
                    .dispatch(login(username, password))
                    .then(() => {
                        const actualActions = store.getActions();
                        const expectedActions = [
                            { type: ActionType.LOGIN_REQUEST },
                            {
                                type: ActionType.LOGIN_FAILURE,
                                payload: {
                                    username,
                                    error: expectedError,
                                    receivedAt: Date.now()
                                }
                            }
                        ];

                        expect(actualActions).toEqual(expectedActions);
                    })
                    .catch(error => {
                        expect(error).toEqual(expectedError);
                    });
            });

            it('sets error state', () => {
                const store = createStoreAsMockStore(managerReducer);

                return store
                    .dispatch(login(username, password))
                    .then(() => {
                        expect(store.getState()).toEqual({
                            ...emptyState,
                            auth: {
                                ...emptyState.auth,
                                username,
                                error: expectedError.message
                            },
                            lastUpdated: Date.now()
                        });
                    })
                    .catch(error => {
                        expect(error).toEqual(expectedError);
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
            const store = mockStore({});

            return store.dispatch(logout()).then(() => {
                const actualActions = store.getActions();
                const expectedActions = [
                    { type: ActionType.CLEAR_CONTEXT },
                    { type: ActionType.LOGOUT, payload: { receivedAt: Date.now() } }
                ];

                expect(actualActions).toEqual(expectedActions);
            });
        });

        it('resets state', () => {
            const store = createStoreAsMockStore(managerReducer);

            return store.dispatch(logout()).then(() => {
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
                const store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            payload: versions.premium
                        },
                        { type: ActionType.SET_LICENSE_REQUIRED, payload: true },
                        { type: ActionType.SET_MANAGER_LICENSE, payload: {} },
                        {
                            type: ActionType.STORE_RBAC,
                            payload: { roles: rbac.roles, permissions: rbac.permissions }
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('changes license state', () => {
                const store = createStoreAsMockStore(licenseReducer as Reducer);

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
                const store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            payload: versions.premium
                        },
                        {
                            type: ActionType.SET_LICENSE_REQUIRED,
                            payload: true
                        },
                        {
                            type: ActionType.SET_MANAGER_LICENSE,
                            payload: licenses.activePayingLicense
                        },
                        {
                            type: ActionType.STORE_RBAC,
                            payload: { roles: rbac.roles, permissions: rbac.permissions }
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('changes license state', () => {
                const store = createStoreAsMockStore(licenseReducer as Reducer);

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
                const store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            payload: versions.premium
                        },
                        {
                            type: ActionType.SET_LICENSE_REQUIRED,
                            payload: true
                        },
                        {
                            type: ActionType.SET_MANAGER_LICENSE,
                            payload: licenses.expiredPayingLicense
                        },
                        {
                            type: ActionType.STORE_RBAC,
                            payload: { roles: rbac.roles, permissions: rbac.permissions }
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('changes license state', () => {
                const store = createStoreAsMockStore(licenseReducer as Reducer);

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
                const store = mockStore({});

                return store.dispatch(getManagerData()).then(() => {
                    const actualActions = store.getActions();
                    const expectedActions = [
                        {
                            type: ActionType.SET_MANAGER_VERSION,
                            payload: versions.community
                        },
                        { type: ActionType.SET_LICENSE_REQUIRED, payload: false },
                        { type: ActionType.SET_MANAGER_LICENSE, payload: null },
                        {
                            type: ActionType.STORE_RBAC,
                            payload: { roles: rbac.roles, permissions: rbac.permissions }
                        }
                    ];

                    expect(actualActions).toEqual(expectedActions);
                });
            });

            it('non-licensed version changes license state', () => {
                const store = createStoreAsMockStore(licenseReducer as Reducer);

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
