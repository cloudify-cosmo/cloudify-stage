/**
 * Created by kinneretzin on 06/12/2016.
 */

import * as types from '../actions/types';

const status = (state = {}, action) => {
    switch (action.type) {
        case types.REQ_MANAGER_STATUS:
            return { ...state, isFetching: true };
        case types.SET_MANAGER_STATUS:
            return { ...state, isFetching: false, error: undefined, status: action.status, services: action.services };

        case types.ERR_MANAGER_STATUS:
            return { ...state, isFetching: false, error: action.error };
    }
};

export default status;
