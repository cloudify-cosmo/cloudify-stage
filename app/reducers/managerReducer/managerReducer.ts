import type { Reducer } from 'redux';
import * as types from '../../actions/types';
import auth from './authReducer';
import clusterStatus from './clusterStatusReducer';
import tenants from './tenantsReducer';
import license from './licenseReducer';
import emptyState from './emptyState';
import type { ClusterStatusData } from './clusterStatusReducer';
import type { LicenseData } from './licenseReducer';
import type { TenantsData } from './tenantsReducer';
import type { VersionResponse } from '../../../backend/routes/Auth.types';
import type { AuthData } from './authReducer';

export interface ManagerData {
    auth: AuthData;
    clusterStatus: ClusterStatusData;
    isLdapEnabled: boolean;
    lastUpdated: any;
    license: LicenseData;
    maintenance: string;
    permissions: Record<string, any>;
    roles: any[];
    tenants: TenantsData;
    version: Partial<VersionResponse>;
}

const manager: Reducer<ManagerData> = (state = emptyState, action) => {
    switch (action.type) {
        case types.REQ_LOGIN:
        case types.RES_LOGIN:
        case types.LOGOUT:
        case types.ERR_LOGIN:
            return {
                ...emptyState,
                auth: auth(state.auth, action),
                lastUpdated: action.receivedAt
            };
        case types.SET_LDAP_ENABLED:
            return { ...state, isLdapEnabled: action.isLdapEnabled };
        case types.SET_USER_DATA:
            return { ...state, auth: auth(state.auth, action) };
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
