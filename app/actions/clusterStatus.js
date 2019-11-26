import * as types from './types';
import Manager from '../utils/Manager';

export function requestClusterStatus() {
    return {
        type: types.REQ_CLUSTER_STATUS
    };
}

export function setClusterStatus(status, services) {
    return {
        type: types.SET_CLUSTER_STATUS,
        status,
        services
    };
}

export function errorClusterStatus(error) {
    return {
        type: types.ERR_CLUSTER_STATUS,
        error
    };
}

export function getClusterStatus() {
    return (dispatch, getState) => {
        const managerAccessor = new Manager(getState().manager);
        dispatch(requestClusterStatus());
        return managerAccessor
            .doGet('/cluster-status')
            .then(data => {
                const { services, status } = data;
                dispatch(setClusterStatus(status, services));
            })
            .catch(err => {
                dispatch(errorClusterStatus(err));
            });
    };
}
