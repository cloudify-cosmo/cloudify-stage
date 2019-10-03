/**
 * Created by edenp on 03/12/2017.
 */
import * as types from './types';
import Manager from '../utils/Manager';

export function requestStatus() {
    return {
        type: types.REQ_MANAGER_STATUS
    };
}

export function setStatus(status, services) {
    return {
        type: types.SET_MANAGER_STATUS,
        status,
        services
    };
}

export function errorStatus(error) {
    return {
        type: types.ERR_MANAGER_STATUS,
        error
    };
}

export function getStatus() {
    return function(dispatch, getState) {
        const managerAccessor = new Manager(getState().manager);
        dispatch(requestStatus());
        return managerAccessor
            .doGet('/status')
            .then(data => {
                const { services, status } = data;
                const filteredServices = _.chain(services)
                    .keys()
                    .map(serviceName => ({
                        name: serviceName,
                        isExternal: services[serviceName].is_external,
                        status: services[serviceName].status,
                        description: _.get(services[serviceName], 'extra_info.systemd.instances[0].Description', '')
                    }))
                    .sortBy(service => service.name)
                    .value();

                dispatch(setStatus(status, filteredServices));
            })
            .catch(err => {
                console.error(err);
                dispatch(errorStatus(err));
            });
    };
}
