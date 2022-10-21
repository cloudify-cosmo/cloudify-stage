import log from 'loglevel';
import { push } from 'connected-react-router';
import type { Action, AnyAction } from 'redux';
import type { ThunkAction } from 'redux-thunk';
import type { PayloadAction } from '../types';
import { ActionType } from '../types';
import type { GetAuthUserResponse } from '../../../backend/routes/Auth.types';
import type { ReduxState } from '../../reducers';
import Auth from '../../utils/auth';
import Consts from '../../utils/consts';
import Manager from '../../utils/Manager';
import { clearContext } from '../context';
import { setLicense, setLicenseRequired } from './license';
import { setVersion } from './version';
import type { ConfigResponse } from '../../../backend/handler/AuthHandler.types';

export type RequestLoginAction = Action<ActionType.REQ_LOGIN>;
export type ReceiveLoginAction = PayloadAction<
    { username: string; role: string; receivedAt: number },
    ActionType.RES_LOGIN
>;
export type ErrorLoginAction = PayloadAction<
    { username: string; error: any; receivedAt: number },
    ActionType.ERR_LOGIN
>;
export type StoreRBACAction = PayloadAction<
    Pick<ConfigResponse['authorization'], 'roles' | 'permissions'>,
    ActionType.STORE_RBAC
>;
export type SetUserDataAction = PayloadAction<GetAuthUserResponse, ActionType.SET_USER_DATA>;
export type SetIdentityProvidersAction = PayloadAction<string[], ActionType.SET_IDENTITY_PROVIDERS>;
export type LogoutAction = PayloadAction<{ error?: string | null; receivedAt: number }, ActionType.LOGOUT>;

export type AuthAction =
    | RequestLoginAction
    | ReceiveLoginAction
    | ErrorLoginAction
    | StoreRBACAction
    | SetUserDataAction
    | SetIdentityProvidersAction
    | LogoutAction;

function requestLogin() {
    return {
        type: ActionType.REQ_LOGIN
    };
}

export function receiveLogin(username: string, role: string): ReceiveLoginAction {
    return {
        type: ActionType.RES_LOGIN,
        payload: { username, role, receivedAt: Date.now() }
    };
}

function errorLogin(username: string, error: any): ErrorLoginAction {
    return {
        type: ActionType.ERR_LOGIN,
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
                        // eslint-disable-next-line xss/no-location-href-assign
                        window.location.href = redirect;
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

function responseUserData(getAuthUserResponse: GetAuthUserResponse): SetUserDataAction {
    return {
        type: ActionType.SET_USER_DATA,
        payload: getAuthUserResponse
    };
}

function isLicenseRequired(versionEdition: string) {
    return versionEdition !== Consts.EDITION.COMMUNITY;
}

export function getManagerData(): ThunkAction<Promise<void>, ReduxState, never, AnyAction> {
    return (dispatch, getState) =>
        Auth.getManagerData(getState().manager).then(({ version, license, rbac }) => {
            dispatch(setVersion(version));
            dispatch(setLicenseRequired(isLicenseRequired(version.edition)));
            dispatch(setLicense(license));
            dispatch(storeRBAC(rbac));
        });
}

export function getUserData(): ThunkAction<Promise<GetAuthUserResponse>, ReduxState, never, AnyAction> {
    return (dispatch, getState) =>
        Auth.getUserData(getState().manager).then(data => {
            dispatch(responseUserData(data));
            return data;
        });
}

function responseIdentityProviders(identityProviders: string[]): SetIdentityProvidersAction {
    return {
        type: ActionType.SET_IDENTITY_PROVIDERS,
        payload: identityProviders
    };
}

export function getIdentityProviders(): ThunkAction<void, ReduxState, never, SetIdentityProvidersAction> {
    return (dispatch, getState) => {
        const manager = new Manager(getState().manager);
        manager
            .doGet('/idp')
            .then(identityProviders => dispatch(responseIdentityProviders(identityProviders.split(','))));
    };
}

function doLogout(error?: string | null): LogoutAction {
    return {
        type: ActionType.LOGOUT,
        payload: {
            error,
            receivedAt: Date.now()
        }
    };
}

export function logout(err?: string | null, path?: string): ThunkAction<void, ReduxState, never, AnyAction> {
    return (dispatch, getState) => {
        const localLogout = () => {
            dispatch(clearContext());
            dispatch(doLogout(err));
            dispatch(push(path || (err ? Consts.PAGE_PATH.ERROR : Consts.PAGE_PATH.LOGOUT)));
        };

        return Auth.logout(getState().manager).then(localLogout, localLogout);
    };
}
