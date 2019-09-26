/**
 * Created by kinneretzin on 06/12/2016.
 */

import * as types from '../actions/types';

const tenants = (state = {}, action) => {
    switch (action.type) {
        case types.REQ_TENANTS:
            return { ...state, isFetching: true };
        case types.RES_TENANTS:
            var selectedTenant = _.get(action.tenants, 'items[0].name', null);
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
        case types.ERR_TENANTS:
            return { ...state, isFetching: false, error: action.error, items: [], lastUpdated: action.receivedAt };
        case types.SELECT_TENANT:
            return { ...state, selected: action.tenant };
    }
};

export default tenants;
