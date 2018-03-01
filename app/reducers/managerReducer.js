import * as types from '../actions/types';
import tenants from './tenantsReducer';
import status from './statusReducer';

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
                    role: action.role,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                err: null,
                serverVersion: action.serverVersion,
                tenants: [],
                lastUpdated: action.receivedAt,
                status: {},
                version: null,
                distribution: null,
                distroRelease: null
            });
        case types.LOGOUT:
            return Object.assign({}, state, {
                isLoggingIn: false,
                auth: {
                    role: null,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                err: null,
                serverVersion: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                status: {},
                version: null,
                distribution: null,
                distroRelease: null
            });
        case types.ERR_LOGIN:
            return Object.assign({}, state, {
                isLoggingIn: false,
                username: action.username,
                auth: {
                    role: null,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                err: (action.error  != null && typeof action.error === 'object' ? action.error.message : action.error),
                serverVersion: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                status: {},
                version: null,
                distribution: null,
                distroRelease: null
            });
        case types.SET_USER_DATA:
            return Object.assign({}, state, {
                username: action.username,
                auth: {
                    role: action.role,
                    groupSystemRoles: action.groupSystemRoles,
                    tenantsRoles: action.tenantsRoles
                },
                serverVersion: action.serverVersion
            });
        case types.REQ_MANAGER_STATUS:
        case types.SET_MANAGER_STATUS:
        case types.ERR_MANAGER_STATUS:
            return Object.assign({}, state, {
                status: status(state.status, action)
            });
        case types.SET_MANAGER_VERSION:
            return Object.assign({}, state, {
                version: action.version,
                distribution: action.distribution,
                distroRelease: action.distroRelease,
            });
        case types.SET_MAINTENANCE_STATUS:
            return Object.assign({}, state, {
                maintenance: action.maintenance
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