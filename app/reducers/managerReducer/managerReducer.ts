import type { Reducer } from 'redux';

import * as types from '../../actions/types';
import tenants from './tenantsReducer';
import type { TenantsData } from './tenantsReducer';
import clusterStatus from './clusterStatusReducer';
import type { ClusterStatusData } from './clusterStatusReducer';
import license from './licenseReducer';
import type { LicenseData } from './licenseReducer';
import type { VersionResponse } from '../../../backend/routes/Auth.types';

export interface ManagerData {
    auth: {
        role: any;
        groupSystemRoles: Record<string, any>;
        tenantsRoles: Record<string, any>;
    };
    clusterStatus: ClusterStatusData;
    err: any;
    isLdapEnabled: boolean;
    isLoggingIn: boolean;
    lastUpdated: any;
    license: LicenseData;
    maintenance: string;
    permissions: Record<string, any>;
    roles: any[];
    tenants: TenantsData;
    username: string;
    version: Partial<VersionResponse>;
}

export const emptyState: ManagerData = {
    auth: {
        role: null,
        groupSystemRoles: {},
        tenantsRoles: {}
    },
    clusterStatus: {},
    err: null,
    isLdapEnabled: false,
    isLoggingIn: false,
    lastUpdated: null,
    license: {},
    maintenance: '',
    permissions: {},
    roles: [],
    tenants: {},
    username: '',
    version: {}
};

const manager: Reducer<ManagerData> = (state = emptyState, action) => {
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
        case types.SET_LDAP_ENABLED:
            return {
                ...state,
                isLdapEnabled: action.isLdapEnabled
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
