import type { Reducer } from 'redux';
import * as types from '../../actions/types';

export interface ClusterStatusObject {
    isFetching?: boolean;
    error?: string;
    status?: string;
    services?: Record<string, any>; // TODO: Add proper typing
}

const clusterStatus: Reducer<ClusterStatusObject> = (state = {}, action) => {
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
