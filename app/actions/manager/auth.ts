import log from 'loglevel';
import type { CallHistoryMethodAction } from 'connected-react-router';
import { push } from 'connected-react-router';
import type { Action } from 'redux';
import type { GetAuthUserResponse } from 'backend/routes/Auth.types';
import type { ConfigResponse } from 'backend/handler/AuthHandler.types';
import type { PayloadAction, ReduxThunkAction } from '../types';
import { ActionType } from '../types';
import Auth from '../../utils/auth';
import Consts from '../../utils/consts';
import Manager from '../../utils/Manager';
import type { ClearContextAction } from '../context';
import { clearContext } from '../context';
import type { SetLicenseAction, SetLicenseRequiredAction } from './license';
import { setLicense, setLicenseRequired } from './license';
import type { SetVersionAction } from './version';
import { setVersion } from './version';

export type LoginRequestAction = Action<ActionType.LOGIN_REQUEST>;
export type LoginSuccessAction = PayloadAction<
    { username: string; role: string; receivedAt: number },
    ActionType.LOGIN_SUCCESS
>;
export type LoginFailureAction = PayloadAction<
    { username: string; error: any; receivedAt: number },
    ActionType.LOGIN_FAILURE
>;
export type StoreRBACAction = PayloadAction<
    Pick<ConfigResponse['authorization'], 'roles' | 'permissions'>,
    ActionType.STORE_RBAC
>;
export type SetUserDataAction = PayloadAction<GetAuthUserResponse, ActionType.SET_USER_DATA>;
export type SetIdentityProvidersAction = PayloadAction<string[], ActionType.SET_IDENTITY_PROVIDERS>;
export type LogoutAction = PayloadAction<{ receivedAt: number }, ActionType.LOGOUT>;

export type AuthAction =
    | LoginRequestAction
    | LoginSuccessAction
    | LoginFailureAction
    | StoreRBACAction
    | SetUserDataAction
    | SetIdentityProvidersAction
    | LogoutAction;

function loginRequest(): LoginRequestAction {
    return {
        type: ActionType.LOGIN_REQUEST
    };
}

export function loginSuccess(username: string, role: string): LoginSuccessAction {
    return {
        type: ActionType.LOGIN_SUCCESS,
        payload: { username, role, receivedAt: Date.now() }
    };
}

function loginFailure(username: string, error: any): LoginFailureAction {
    return {
        type: ActionType.LOGIN_FAILURE,
        payload: {
            username,
            error,
            receivedAt: Date.now()
        }
    };
}

export function storeRBAC(RBAC: ConfigResponse['authorization']): StoreRBACAction {
    return {
        type: ActionType.STORE_RBAC,
        payload: { roles: RBAC.roles, permissions: RBAC.permissions }
    };
}

export function login(
    username: string,
    password: string,
    redirect?: string
): ReduxThunkAction<
    Promise<void>,
    LoginRequestAction | LoginSuccessAction | LoginFailureAction | CallHistoryMethodAction
> {
    return dispatch => {
        dispatch(loginRequest());
        return Auth.login(username, password)
            .then(({ role }) => {
                dispatch(loginSuccess(username, role));
                if (redirect) {
                    // NOTE: Using react router for internal paths to keep logged in state
                    if (redirect.startsWith(Consts.CONTEXT_PATH)) {
                        const routePath = redirect.replace(Consts.CONTEXT_PATH, '');
                        dispatch(push(routePath));
                    } else {
                        // eslint-disable-next-line xss/no-location-href-assign
                        window.location.href = redirect;
                    }
                } else {
                    dispatch(push(Consts.PAGE_PATH.HOME));
                }
            })
            .catch(err => {
                log.log(err);
                dispatch(loginFailure(username, err));
                throw err;
            });
    };
}

function setUserData(getAuthUserResponse: GetAuthUserResponse): SetUserDataAction {
    return {
        type: ActionType.SET_USER_DATA,
        payload: getAuthUserResponse
    };
}

function isLicenseRequired(versionEdition: string) {
    return versionEdition !== Consts.EDITION.COMMUNITY;
}

export function getManagerData(): ReduxThunkAction<
    Promise<void>,
    SetVersionAction | SetLicenseAction | SetLicenseRequiredAction | StoreRBACAction
> {
    return (dispatch, getState) =>
        Auth.getManagerData(getState().manager).then(({ version, license, rbac }) => {
            dispatch(setVersion(version));
            dispatch(setLicenseRequired(isLicenseRequired(version.edition)));
            dispatch(setLicense(license));
            dispatch(storeRBAC(rbac));
        });
}

export function getUserData(): ReduxThunkAction<Promise<GetAuthUserResponse>, SetUserDataAction> {
    return (dispatch, getState) =>
        Auth.getUserData(getState().manager).then(data => {
            dispatch(setUserData(data));
            return data;
        });
}

function setIdentityProviders(identityProviders: string[]): SetIdentityProvidersAction {
    return {
        type: ActionType.SET_IDENTITY_PROVIDERS,
        payload: identityProviders
    };
}

export function getIdentityProviders(): ReduxThunkAction<void, SetIdentityProvidersAction> {
    return (dispatch, getState) => {
        const manager = new Manager(getState().manager);
        manager.doGet('/idp').then(identityProviders => dispatch(setIdentityProviders(identityProviders.split(','))));
    };
}

function doLogout(): LogoutAction {
    return {
        type: ActionType.LOGOUT,
        payload: {
            receivedAt: Date.now()
        }
    };
}

export function logout(): ReduxThunkAction<Promise<void>, ClearContextAction | LogoutAction | CallHistoryMethodAction> {
    return (dispatch, getState) => {
        const localLogout = () => {
            dispatch(clearContext());
            dispatch(doLogout());
        };

        return Auth.logout(getState().manager).then(localLogout, localLogout);
    };
}
