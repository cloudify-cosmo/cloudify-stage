import type { Reducer } from 'redux';
import _ from 'lodash';
import { ActionType } from '../../actions/types';
import type { TenantAction } from '../../actions/manager/tenants';

export interface TenantsData {
    isFetching?: boolean;
    items?: {
        name: string;
    }[];
    selected?: string;
    lastUpdated?: number;
    error?: string;
}

const tenants: Reducer<TenantsData, TenantAction> = (state = {}, action) => {
    let selectedTenant;
    switch (action.type) {
        case ActionType.REQ_TENANTS:
            return { ...state, isFetching: true };
        case ActionType.RES_TENANTS:
            selectedTenant = _.get(action.payload.tenants, 'items[0].name', null);
            if (!_.isEmpty(state.selected) && _.find(action.payload.tenants.items, { name: state.selected }) != null) {
                selectedTenant = state.selected;
            }
            return {
                ...state,
                isFetching: false,
                items: action.payload.tenants.items,
                selected: selectedTenant,
                lastUpdated: action.payload.receivedAt
            };
        case ActionType.ERR_TENANTS:
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
