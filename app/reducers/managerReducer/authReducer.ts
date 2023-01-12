import type { Reducer } from 'redux';
import { ActionType } from '../../actions/types';
import emptyState from './emptyState';
import type { AuthAction } from '../../actions/manager/auth';

export type AuthState = 'loggedOut' | 'loggingIn' | 'loggedIn';
export type IdentityProvider = 'local' | 'okta' | 'ldap' | string;

export interface AuthData {
    username: string;
    role: string;
    groupSystemRoles: Record<string, any>;
    tenantsRoles: Record<string, any>;
    state: AuthState;
    identityProviders: IdentityProvider[];
    error: any;
    showGettingStarted: boolean;
}

const emptyAuthState = emptyState.auth;

const auth: Reducer<AuthData, AuthAction> = (state = emptyAuthState, action) => {
    switch (action.type) {
        case ActionType.LOGIN_REQUEST:
            return {
                ...emptyAuthState,
                state: 'loggingIn'
            };
        case ActionType.LOGIN_SUCCESS:
            return {
                ...emptyAuthState,
                username: action.payload.username,
                role: action.payload.role,
                state: 'loggedIn'
            };
        case ActionType.LOGOUT:
            return emptyAuthState;
        case ActionType.LOGIN_FAILURE:
            return {
                ...emptyAuthState,
                username: action.payload.username,
                error:
                    action.payload.error !== null && typeof action.payload.error === 'object'
                        ? action.payload.error.message
                        : action.payload.error
            };
        case ActionType.SET_USER_DATA:
            return {
                ...state,
                ...action.payload
            };
        case ActionType.SET_IDENTITY_PROVIDERS:
            return {
                ...state,
                identityProviders: action.payload
            };
        case ActionType.HIDE_GETTING_STARTED:
            return {
                ...state,
                showGettingStarted: false
            };
        default:
            return state;
    }
};

export default auth;
