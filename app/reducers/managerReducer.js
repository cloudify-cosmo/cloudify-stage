import * as types from '../actions/types';
import tenants from './tenantsReducer';

const manager = (state = {}, action) => {
    switch (action.type) {
        case types.REQ_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: true
            });
        case types.RES_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                ip: action.ip,
                username: action.username,
                auth: {
                    isSecured : true,
                    token: action.token,
                    role: action.role
                },
                err: null,
                version: action.version,
                tenants: tenants(state.tenants,action),
                lastUpdated: action.receivedAt,
                status: null,
                badStatusCount : 0
            });
        case types.LOGOUT:
            return Object.assign({}, state, {
                isLoggingIn: false,
                auth: {
                    isSecured : true,
                    token: null,
                    role: null
                },
                err: action.error,
                version: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                status: null,
                badStatusCount : 0
            });
        case types.ERR_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                ip: action.ip,
                username: action.username,
                auth: {
                    isSecured : true,
                    token: null,
                    role: null
                },
                err: (action.error  != null && typeof action.error === 'object' ? action.error.message : action.error),
                version: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                status: null,
                badStatusCount : 0
            });

        case types.SET_MANAGER_STATUS:
            return Object.assign({}, state, {
                status: action.status,
                badStatusCount: action.status === 'Error' ? state.badStatusCount +1 : 0
            });
        case types.REQ_TENANTS:
        case types.RES_TENANTS:
        case types.ERR_TENANTS:
        case types.SELECT_TENANT:
            return Object.assign({},state,{
                tenants: tenants(state.tenants,action)
            });
        default:
            return state;
    }
};

export default manager;