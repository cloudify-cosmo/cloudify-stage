// @ts-nocheck File not migrated fully to TS

import log from 'loglevel';
import { push } from 'connected-react-router';
import type { ThunkAction, AnyAction } from 'redux';

import * as types from './types';
import Auth from '../utils/auth';
import Consts from '../utils/consts';
import Manager from '../utils/Manager';
import ExecutionUtils from '../utils/shared/ExecutionUtils';
import { clearContext } from './context';
import { setLicense, setLicenseRequired } from './license';
import { setVersion } from './version';
import type { ReduxState } from '../reducers';

function requestLogin() {
    return {
        type: types.REQ_LOGIN
    };
}

export function receiveLogin(username, role) {
    return {
        type: types.RES_LOGIN,
        username,
        role,
        receivedAt: Date.now()
    };
}

function errorLogin(username, err) {
    return {
        type: types.ERR_LOGIN,
        username,
        error: err,
        receivedAt: Date.now()
    };
}

export function storeRBAC(RBAC) {
    return {
        type: types.STORE_RBAC,
        roles: RBAC.roles,
        permissions: RBAC.permissions
    };
}

export function login(
    username: string,
    password: string,
    redirect?: string
): ThunkAction<void, ReduxState, never, AnyAction> {
    return dispatch => {
        dispatch(requestLogin());
        return Auth.login(username, password)
            .then(({ role }) => {
                dispatch(receiveLogin(username, role));
                if (redirect) {
                    // NOTE: Using react router for internal paths to keep logged in state
                    if (redirect.startsWith(Consts.CONTEXT_PATH)) {
                        const routePath = redirect.replace(Consts.CONTEXT_PATH, '');
                        dispatch(push(routePath));
                    } else {
                        // eslint-disable-next-line scanjs-rules/assign_to_location
                        window.location = redirect;
                    }
                } else {
                    dispatch(push(Consts.PAGE_PATH.HOME));
                }
            })
            .catch(err => {
                log.log(err);
                dispatch(errorLogin(username, err));
            });
    };
}

function responseUserData(username, systemRole, groupSystemRoles, tenantsRoles) {
    return {
        type: types.SET_USER_DATA,
        username,
        role: systemRole,
        groupSystemRoles,
        tenantsRoles
    };
}

function isLicenseRequired(versionEdition) {
    return versionEdition !== Consts.EDITION.COMMUNITY;
}

export function getManagerData(): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) =>
        Auth.getManagerData(getState().manager).then(({ version, license, rbac }) => {
            dispatch(setVersion(version));
            dispatch(setLicenseRequired(isLicenseRequired(version.edition)));
            dispatch(setLicense(license));
            dispatch(storeRBAC(rbac));
        });
}

export function getUserData(): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) =>
        Auth.getUserData(getState().manager).then(data => {
            dispatch(responseUserData(data.username, data.role, data.groupSystemRoles, data.tenantsRoles));
            return data;
        });
}

function responseIdentityProviders(identityProviders: string) {
    return {
        type: types.SET_IDENTITY_PROVIDERS,
        identityProviders
    };
}

export function getIdentityProviders() {
    return (dispatch, getState) => {
        const manager = new Manager(getState().manager);
        manager.doGet('/idp').then(identityProviders => dispatch(responseIdentityProviders(identityProviders)));
    };
}

function doLogout(err) {
    return {
        type: types.LOGOUT,
        error: err,
        receivedAt: Date.now()
    };
}

export function logout(err?, path?): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const localLogout = () => {
            dispatch(clearContext());
            dispatch(doLogout(err));
            dispatch(push(path || (err ? Consts.PAGE_PATH.ERROR : Consts.PAGE_PATH.LOGOUT)));
        };

        return Auth.logout(getState().manager).then(localLogout, localLogout);
    };
}

export function setMaintenanceStatus(maintenance) {
    return {
        type: types.SET_MAINTENANCE_STATUS,
        maintenance,
        receivedAt: Date.now()
    };
}

export function getMaintenanceStatus(manager) {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor
            .doGet('/maintenance')
            .then(data => {
                dispatch(setMaintenanceStatus(data.status));
            })
            .catch(err => {
                log.error(err);
            });
}

export function switchMaintenance(manager, activate) {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor.doPost(`/maintenance/${activate ? 'activate' : 'deactivate'}`).then(data => {
            dispatch(setMaintenanceStatus(data.status));
            dispatch(push(activate ? Consts.PAGE_PATH.MAINTENANCE : Consts.PAGE_PATH.HOME));
        });
}

export function setActiveExecutions(activeExecutions) {
    return {
        type: types.SET_ACTIVE_EXECUTIONS,
        activeExecutions
    };
}

export function getActiveExecutions(manager) {
    const managerAccessor = new Manager(manager);

    return dispatch => {
        const maintenanceModeActivationBlockingStatuses = [
            ...ExecutionUtils.WAITING_EXECUTION_STATUSES,
            ...ExecutionUtils.ACTIVE_EXECUTION_STATUSES
        ];
        return managerAccessor
            .doGet('/executions?_include=id,workflow_id,status,status_display,blueprint_id,deployment_id', {
                params: {
                    status: maintenanceModeActivationBlockingStatuses
                }
            })
            .then(data => {
                dispatch(setActiveExecutions(data));
            });
    };
}

export function cancelExecution(execution, action) {
    return {
        type: types.CANCEL_EXECUTION,
        execution,
        action
    };
}

export function doCancelExecution(manager, execution, action) {
    const managerAccessor = new Manager(manager);
    return dispatch =>
        managerAccessor
            .doPost(`/executions/${execution.id}`, { body: { deployment_id: execution.deployment_id, action } })
            .then(() => {
                dispatch(cancelExecution(execution, action));
            });
}
