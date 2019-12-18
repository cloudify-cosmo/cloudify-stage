import * as types from '../actions/types';
import tenants from './tenantsReducer';
import clusterStatus from './clusterStatusReducer';
import license from './licenseReducer';

const manager = (state = {}, action) => {
    switch (action.type) {
        case types.REQ_LOGIN:
            return { ...state, isLoggingIn: true };
        case types.RES_LOGIN:
            return {
                ...state,
                isLoggingIn: false,
                username: action.username,
                auth: {
                    role: action.role,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                err: null,
                tenants: [],
                lastUpdated: action.receivedAt,
                clusterStatus: {},
                license: license(state.license, action),
                version: action.version
            };
        case types.LOGOUT:
            return {
                ...state,
                isLoggingIn: false,
                auth: {
                    role: null,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                err: null,
                tenants: {},
                lastUpdated: action.receivedAt,
                clusterStatus: {},
                license: {},
                version: {}
            };
        case types.ERR_LOGIN:
            return {
                ...state,
                isLoggingIn: false,
                username: action.username,
                auth: {
                    role: null,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                err: action.error != null && typeof action.error === 'object' ? action.error.message : action.error,
                tenants: {},
                lastUpdated: action.receivedAt,
                clusterStatus: {},
                license: {},
                version: {}
            };
        case types.SET_USER_DATA:
            return {
                ...state,
                username: action.username,
                auth: {
                    role: action.role,
                    groupSystemRoles: action.groupSystemRoles,
                    tenantsRoles: action.tenantsRoles
                }
            };
        case types.REQ_CLUSTER_STATUS:
        case types.SET_CLUSTER_STATUS:
        case types.ERR_CLUSTER_STATUS:
            return { ...state, clusterStatus: clusterStatus(state.clusterStatus, action) };
        case types.SET_MANAGER_VERSION:
            return { ...state, version: action.version };
        case types.SET_MANAGER_LICENSE:
            return { ...state, license: license(state.license, action) };
        case types.SET_MAINTENANCE_STATUS:
            return { ...state, maintenance: action.maintenance };
        case types.REQ_TENANTS:
        case types.RES_TENANTS:
        case types.ERR_TENANTS:
        case types.SELECT_TENANT:
            return { ...state, tenants: tenants(state.tenants, action) };
        case types.SET_ACTIVE_EXECUTIONS:
            return { ...state, activeExecutions: action.activeExecutions ? action.activeExecutions : {} };
        case types.CANCEL_EXECUTION:
            return { ...state, cancelExecution: action.execution, cancelAction: action.action };
        case types.STORE_RBAC:
            return { ...state, roles: action.roles, permissions: action.permissions };
        default:
            return state;
    }
};

export default manager;
