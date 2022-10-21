import type { Reducer } from 'redux';
import { ActionType } from '../../actions/types';
import type { ClusterServices } from '../../components/shared/cluster/types';
import type { ClusterStatusAction } from '../../actions/manager/clusterStatus';

export interface ClusterStatusData {
    isFetching?: boolean;
    error?: string;
    status?: string;
    services?: ClusterServices;
}

const clusterStatus: Reducer<ClusterStatusData, ClusterStatusAction> = (state = {}, action) => {
    switch (action.type) {
        case ActionType.REQ_CLUSTER_STATUS:
            return { ...state, isFetching: true };
        case ActionType.SET_CLUSTER_STATUS:
            return {
                isFetching: false,
                error: undefined,
                status: action.payload.status,
                services: action.payload.services || state.services
            };
        case ActionType.ERR_CLUSTER_STATUS:
            return { ...state, isFetching: false, error: action.payload.error };
        default:
            return state;
    }
};

export default clusterStatus;
