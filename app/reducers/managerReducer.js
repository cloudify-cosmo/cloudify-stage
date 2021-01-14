import * as types from '../actions/types';
import tenants from './tenantsReducer';
import clusterStatus from './clusterStatusReducer';
import license from './licenseReducer';

const emptyState = {
    auth: {
        role: null,
        groupSystemRoles: {},
        tenantsRoles: {}
    },
    clusterStatus: {},
    err: null,
    isLoggingIn: false,
    lastUpdated: null,
    license: {},
    permissions: {},
    roles: [],
    tenants: {},
    version: {}
};

const manager = (state = emptyState, action) => {
    switch (action.type) {
        case types.REQ_LOGIN:
            return { ...state, isLoggingIn: true };
        case types.RES_LOGIN:
            return {
                ...emptyState,
                username: action.username,
                auth: {
                    role: action.role,
                    groupSystemRoles: {},
                    tenantsRoles: {}
                },
                lastUpdated: action.receivedAt
            };
        case types.LOGOUT:
            return {
                ...emptyState,
                lastUpdated: action.receivedAt
            };
        case types.ERR_LOGIN:
            return {
                ...emptyState,
                username: action.username,
                err: action.error !== null && typeof action.error === 'object' ? action.error.message : action.error,
                lastUpdated: action.receivedAt
            };
        case types.SET_LDAP:
            return {
                ...state,
                isLdap: action.isLdap
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
        case types.SET_LICENSE_REQUIRED:
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
