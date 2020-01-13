import * as types from '../actions/types';

const clusterStatus = (state = {}, action) => {
    switch (action.type) {
        case types.REQ_CLUSTER_STATUS:
            return { ...state, isFetching: true };
        case types.SET_CLUSTER_STATUS:
            return {
                isFetching: false,
                error: undefined,
                status: action.status,
                services: action.services || state.services
            };
        case types.ERR_CLUSTER_STATUS:
            return { ...state, isFetching: false, error: action.error };
        default:
            return state;
    }
};

export default clusterStatus;
