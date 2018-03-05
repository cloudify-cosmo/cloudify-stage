/**
 * Created by edenp on 03/12/2017.
 */
import * as types from './types';
import Manager from '../utils/Manager';

export function setVersion(version, distribution, distroRelease) {
    return {
        type: types.SET_MANAGER_VERSION,
        version,
        distribution,
        distroRelease
    }
}

export function getVersion () {
    return function(dispatch, getState) {
        var managerAccessor = new Manager(getState().manager);
        return managerAccessor.doGet('/version')
            .then((data)=>{
                dispatch(setVersion(data.version, data.distribution, data.distro_release));
            });
    }
}