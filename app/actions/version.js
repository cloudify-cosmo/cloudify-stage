/**
 * Created by edenp on 03/12/2017.
 */
import * as types from './types';
import Manager from '../utils/Manager';

export function setVersion(version) {
    return {
        type: types.SET_MANAGER_VERSION,
        version
    }
}

export function getVersion () {
    return function(dispatch, getState) {
        var managerAccessor = new Manager(getState().manager);
        return managerAccessor.doGet('/version')
            .then((version)=>{
                dispatch(setVersion(version));
            });
    }
}