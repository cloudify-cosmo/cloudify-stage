import type { Reducer } from 'redux';
import { find, isEmpty } from 'lodash';
import { ActionType } from '../../actions/types';
import type { TenantAction } from '../../actions/manager/tenants';

export interface TenantsData {
    isFetching?: boolean;
    items?: string[];
    selected?: string | null;
    lastUpdated?: number;
    error?: string;
}

const tenants: Reducer<TenantsData, TenantAction> = (state = {}, action) => {
    let selectedTenant;
    switch (action.type) {
        case ActionType.FETCH_TENANTS_REQUEST:
            return { ...state, isFetching: true };
        case ActionType.FETCH_TENANTS_SUCCESS:
            selectedTenant = action.payload.tenants[0] || null;
            if (!isEmpty(state.selected) && find(action.payload.tenants, tenant => tenant === state.selected) != null) {
                selectedTenant = state.selected;
            }
            return {
                ...state,
                isFetching: false,
                items: action.payload.tenants,
                selected: selectedTenant,
                lastUpdated: action.payload.receivedAt
            };
        case ActionType.FETCH_TENANTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.payload.error,
                items: [],
                lastUpdated: action.payload.receivedAt
            };
        case ActionType.SELECT_TENANT:
            return { ...state, selected: action.payload };
        default:
            return state;
    }
};

export default tenants;
