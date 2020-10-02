/**
 * Created by kinneretzin on 11/12/2016.
 */

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';

import timeKeeper from 'timekeeper';

import TenantReducer from 'reducers/tenantsReducer.js';
import { getTenants, selectTenant } from 'actions/tenants.js';

import * as types from 'actions/types.js';

const fetchMock = require('fetch-mock');

const mockStore = configureMockStore([thunk]);

const time = new Date(1);

describe('(Reducer) Tenants', () => {
    const managerData = {
        version: 'v3',
        ip: '10.10.10.10',
        auth: {
            isSecured: true,
            token: 'aaa'
        }
    };

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
            body: { items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }] },
            headers: { 'content-type': 'application/json' }
        });

        const expectedActions = [
            { type: types.REQ_TENANTS },
            {
                type: types.RES_TENANTS,
                tenants: { items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }] },
                receivedAt: Date.now()
            }
        ];

        const store = mockStore({});

        return store.dispatch(getTenants(managerData)).then(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates error action when fetching tenants returns an error', () => {
        console.error = jest.fn();

        fetchMock.get(/sp*/, {
            status: 500,
            body: { message: 'Error fetching tenants' },
            headers: { 'content-type': 'application/json' }
        });

        const expectedActions = [
            { type: types.REQ_TENANTS },
            { type: types.ERR_TENANTS, error: 'Error fetching tenants', receivedAt: Date.now() }
        ];

        const store = mockStore({});
        store.replaceReducer(TenantReducer);

        return store.dispatch(getTenants(managerData)).catch(() => {
            // return of async actions
            expect(store.getActions()).toEqual(expectedActions);
            expect(console.error).toHaveBeenCalled();
        });
    });

    it('Store has an error if fetch tenants produces an error', () => {
        console.error = jest.fn();

        fetchMock.get(/sp*/, {
            status: 500,
            body: { message: 'Error fetching tenants' },
            headers: { 'content-type': 'application/json' }
        });

        const store = createStore(TenantReducer, {}, applyMiddleware(thunk));

        return store.dispatch(getTenants(managerData)).catch(() => {
            // return of async actions
            expect(store.getState()).toEqual({
                isFetching: false,
                error: 'Error fetching tenants',
                items: [],
                lastUpdated: Date.now()
            });
            expect(console.error).toHaveBeenCalled();
        });
    });

    it('store has success and tenants data if fetch tenants is ok', () => {
        fetchMock.get(/sp*/, {
            body: { items: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }] },
            headers: { 'content-type': 'application/json' }
        });

        const store = createStore(TenantReducer, {}, applyMiddleware(thunk));

        return store.dispatch(getTenants(managerData)).then(() => {
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
        expect(TenantReducer({}, selectTenant('abc'))).toEqual({
            selected: 'abc'
        });
    });
});
