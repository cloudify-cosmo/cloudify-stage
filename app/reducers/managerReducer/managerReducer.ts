import type { Reducer } from 'redux';
import { ActionType } from '../../actions/types';
import auth from './authReducer';
import clusterStatus from './clusterStatusReducer';
import tenants from './tenantsReducer';
import license from './licenseReducer';
import emptyState from './emptyState';
import type { ClusterStatusData } from './clusterStatusReducer';
import type { LicenseData } from './licenseReducer';
import type { TenantsData } from './tenantsReducer';
import type { VersionResponse } from '../../../backend/handler/AuthHandler.types';
import type { AuthData } from './authReducer';
import type { AuthAction } from '../../actions/manager/auth';
import type { ClusterStatusAction } from '../../actions/manager/clusterStatus';
import type { SetVersionAction } from '../../actions/manager/version';
import type { TenantAction } from '../../actions/manager/tenants';
import type { LicenseAction } from '../../actions/manager/license';
import type { MaintenanceAction } from '../../actions/manager/maintenance';

export interface ManagerData {
    auth: AuthData;
    clusterStatus: ClusterStatusData;
    lastUpdated: number | null;
    license: LicenseData;
    maintenance: string;
    permissions: Record<string, any>;
    roles: {
        id: number;
        name: string;
        type: string;
        description: string;
    }[];
    tenants: TenantsData;
    version: Partial<VersionResponse>;
}

type ManagerAction =
    | AuthAction
    | ClusterStatusAction
    | SetVersionAction
    | TenantAction
    | LicenseAction
    | MaintenanceAction;

const manager: Reducer<ManagerData, ManagerAction> = (state = emptyState, action) => {
    switch (action.type) {
        case ActionType.REQ_LOGIN:
            return {
                ...emptyState,
                auth: auth(state.auth, action)
            };
        case ActionType.RES_LOGIN:
        case ActionType.LOGOUT:
        case ActionType.ERR_LOGIN:
            return {
                ...emptyState,
                auth: auth(state.auth, action),
                lastUpdated: action.payload.receivedAt
            };
        case ActionType.SET_IDENTITY_PROVIDERS:
        case ActionType.SET_USER_DATA:
            return { ...state, auth: auth(state.auth, action) };
        case ActionType.REQ_CLUSTER_STATUS:
        case ActionType.SET_CLUSTER_STATUS:
        case ActionType.ERR_CLUSTER_STATUS:
            return { ...state, clusterStatus: clusterStatus(state.clusterStatus, action) };
        case ActionType.SET_MANAGER_VERSION:
            return { ...state, version: action.payload };
        case ActionType.SET_MANAGER_LICENSE:
        case ActionType.SET_LICENSE_REQUIRED:
            return { ...state, license: license(state.license, action) };
        case ActionType.SET_MAINTENANCE_STATUS:
            return { ...state, maintenance: action.payload };
        case ActionType.REQ_TENANTS:
        case ActionType.RES_TENANTS:
        case ActionType.ERR_TENANTS:
        case ActionType.SELECT_TENANT:
            return { ...state, tenants: tenants(state.tenants, action) };
        case ActionType.SET_ACTIVE_EXECUTIONS:
            return { ...state, activeExecutions: action.payload ? action.payload : {} };
        case ActionType.SET_CANCEL_EXECUTION:
            return { ...state, cancelExecution: action.payload.execution, cancelAction: action.payload.action };
        case ActionType.STORE_RBAC:
            return { ...state, roles: action.payload.roles, permissions: action.payload.permissions };
        default:
            return state;
    }
};

export default manager;
