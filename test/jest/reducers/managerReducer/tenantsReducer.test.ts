import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import type { Reducer, AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import timeKeeper from 'timekeeper';

import type { TenantsData } from 'reducers/managerReducer/tenantsReducer';
import tenantsReducer from 'reducers/managerReducer/tenantsReducer';
import { getTenants, selectTenant } from 'actions/manager/tenants';
import { ActionType } from 'actions/types';

import fetchMock from 'fetch-mock';
import log from 'loglevel';
import type { ReduxState } from 'reducers';

const mockStore = configureMockStore<Partial<ReduxState>, ThunkDispatch<ReduxState, never, AnyAction>>([thunk]);

const time = new Date(1);

describe('(Reducer) Tenants', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    beforeAll(() => {
        timeKeeper.freeze(time);
    });

    afterAll(() => {
        timeKeeper.reset();
    });

    it('creates success action when fetching tenants has been done', () => {
        fetchMock.get('*', {
            body: {
                items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]
            },
            headers: { 'content-type': 'application/json' }
        });

        const expectedActions = [
            { type: ActionType.REQ_TENANTS },
            {
                type: ActionType.RES_TENANTS,
                payload: {
                    tenants: {
                        items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]
                    },
                    receivedAt: Date.now()
                }
            }
        ];

        const store = mockStore({});

        return store.dispatch(getTenants()).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates error action when fetching tenants returns an error', () => {
        log.error = jest.fn();

        fetchMock.get(/sp*/, {
            status: 500,
            body: { message: 'Error fetching tenants' },
            headers: { 'content-type': 'application/json' }
        });

        const expectedActions = [
            { type: ActionType.REQ_TENANTS },
            {
                type: ActionType.ERR_TENANTS,
                payload: {
                    error: 'Error fetching tenants',
                    receivedAt: Date.now()
                }
            }
        ];

        const store = mockStore({});
        store.replaceReducer(tenantsReducer as Reducer);

        return store.dispatch(getTenants()).catch(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
            expect(log.error).toHaveBeenCalled();
        });
    });

    it('Store has an error if fetch tenants produces an error', () => {
        log.error = jest.fn();

        fetchMock.get(/sp*/, {
            status: 500,
            body: { message: 'Error fetching tenants' },
            headers: { 'content-type': 'application/json' }
        });

        const store = createStore<TenantsData, AnyAction, any, any>(tenantsReducer, {}, applyMiddleware(thunk));

        return store.dispatch(getTenants()).catch(() => {
            // return of async actions
            expect(store.getState()).toEqual({
                isFetching: false,
                error: 'Error fetching tenants',
                items: [],
                lastUpdated: Date.now()
            });
            expect(log.error).toHaveBeenCalled();
        });
    });

    it('store has success and tenants data if fetch tenants is ok', () => {
        fetchMock.get(/sp*/, {
            body: {
                items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }]
            },
            headers: { 'content-type': 'application/json' }
        });

        const store = createStore<TenantsData, AnyAction, any, any>(tenantsReducer, {}, applyMiddleware(thunk));

        return store.dispatch(getTenants()).then(() => {
            // return of async actions
            expect(store.getState()).toEqual({
                isFetching: false,
                items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }],
                selected: 'aaa',
                lastUpdated: Date.now()
            });
        });
    });

    it('should handle selectTenant', () => {
        expect(tenantsReducer({}, selectTenant('abc'))).toEqual({
            selected: 'abc'
        });
    });
});
