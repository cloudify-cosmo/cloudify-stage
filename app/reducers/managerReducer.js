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
                username: action.username,
                auth: {
                    role: action.role
                },
                err: null,
                serverVersion: action.serverVersion,
                tenants: [],
                lastUpdated: action.receivedAt,
                status: null,
                badStatusCount : 0
            });
        case types.LOGOUT:
            return Object.assign({}, state, {
                isLoggingIn: false,
                auth: {
                    role: null
                },
                err: (action.error  != null && typeof action.error === 'object' ? action.error.message : action.error),
                serverVersion: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                status: null,
                badStatusCount : 0
            });
        case types.ERR_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                username: action.username,
                auth: {
                    role: null
                },
                err: (action.error  != null && typeof action.error === 'object' ? action.error.message : action.error),
                serverVersion: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                status: null,
                badStatusCount : 0
            });
        case types.SET_USER_DATA:
            return Object.assign({}, state, {
                username: action.username,
                auth: {
                    role: action.role
                },
                serverVersion: action.serverVersion,
            });
        case types.SET_MANAGER_STATUS:
            return Object.assign({}, state, {
                status: action.status,
                maintenance: action.maintenance,
                services: action.services,
                badStatusCount: action.status === 'Error' ? state.badStatusCount +1 : 0
            });
        case types.REQ_TENANTS:
        case types.RES_TENANTS:
        case types.ERR_TENANTS:
        case types.SELECT_TENANT:
            return Object.assign({},state,{
                tenants: tenants(state.tenants,action)
            });
        case types.SET_ACTIVE_EXECUTIONS:
            return Object.assign({},state,{
                activeExecutions: action.activeExecutions ? action.activeExecutions : {}
            });
        case types.CANCEL_EXECUTION:
            return Object.assign({},state,{
                cancelExecution: action.execution,
                cancelAction: action.action
            });
        case types.STORE_RBAC:
            return {...state, roles: action.roles, permissions: action.permissions};
        default:
            return state;
    }
};

export default manager;