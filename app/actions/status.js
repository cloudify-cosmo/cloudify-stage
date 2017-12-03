/**
 * Created by edenp on 03/12/2017.
 */
import * as types from './types';
import Manager from '../utils/Manager';

export function requestStatus() {
    return {
        type: types.REQ_MANAGER_STATUS,
    }
}

export function setStatus(status, services) {
    return {
        type: types.SET_MANAGER_STATUS,
        status,
        services
    }
}

export function errorStatus(error) {
    return {
        type: types.ERR_MANAGER_STATUS,
        error
    }
}

export function getStatus () {
    return function(dispatch, getState) {
        var managerAccessor = new Manager(getState().manager);
        dispatch(requestStatus());
        return managerAccessor.doGet('/status')
            .then((data)=>{
                var services = _.filter(data.services, item => !_.isEmpty(item.instances));
                dispatch(setStatus(data.status, services));
            }).catch((err)=>{
                console.error(err);
                dispatch(errorStatus(err));
            });
    }
}