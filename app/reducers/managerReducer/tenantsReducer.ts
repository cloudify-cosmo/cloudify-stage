import type { Reducer } from 'redux';
import _ from 'lodash';
import { ActionType } from '../../actions/types';

export interface TenantsData {
    isFetching?: boolean;
    items?: {
        name: string;
    }[];
    selected?: string;
    lastUpdated?: number;
    error?: string;
}

const tenants: Reducer<TenantsData> = (state = {}, action) => {
    let selectedTenant;
    switch (action.type) {
        case ActionType.REQ_TENANTS:
            return { ...state, isFetching: true };
        case ActionType.RES_TENANTS:
            selectedTenant = _.get(action.tenants, 'items[0].name', null);
            if (!_.isEmpty(state.selected) && _.find(action.tenants.items, { name: state.selected }) != null) {
                selectedTenant = state.selected;
            }
            return {
                ...state,
                isFetching: false,
                items: action.tenants.items,
                selected: selectedTenant,
                lastUpdated: action.receivedAt
            };
        case ActionType.ERR_TENANTS:
            return { ...state, isFetching: false, error: action.error, items: [], lastUpdated: action.receivedAt };
        case ActionType.SELECT_TENANT:
            return { ...state, selected: action.tenant };
        default:
            return state;
    }
};

export default tenants;
