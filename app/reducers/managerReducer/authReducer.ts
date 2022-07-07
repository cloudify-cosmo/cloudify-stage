import type { Reducer } from 'redux';
import * as types from '../../actions/types';
import emptyState from './emptyState';

export type AuthState = 'loggedOut' | 'loggingIn' | 'loggedIn';
export type IdentityProvider = 'local' | 'okta' | 'ldap' | string;

export interface AuthData {
    username: string;
    role: any;
    groupSystemRoles: Record<string, any>;
    tenantsRoles: Record<string, any>;
    state: AuthState;
    identityProviders: IdentityProvider[];
    error: any;
    showGettingStarted: boolean;
}

const emptyAuthState = emptyState.auth;

const auth: Reducer<AuthData> = (state = emptyAuthState, action) => {
    switch (action.type) {
        case types.REQ_LOGIN:
            return {
                ...emptyAuthState,
                state: 'loggingIn'
            };
        case types.RES_LOGIN:
            return {
                ...emptyAuthState,
                username: action.username,
                role: action.role,
                state: 'loggedIn'
            };
        case types.LOGOUT:
            return emptyAuthState;
        case types.ERR_LOGIN:
            return {
                ...emptyAuthState,
                username: action.username,
                error: action.error !== null && typeof action.error === 'object' ? action.error.message : action.error
            };
        case types.SET_USER_DATA:
            return {
                ...state,
                username: action.username,
                role: action.role,
                groupSystemRoles: action.groupSystemRoles,
                tenantsRoles: action.tenantsRoles,
                showGettingStarted: action.showGettingStarted
            };
        case types.SET_IDENTITY_PROVIDERS:
            return {
                ...state,
                identityProviders: action.identityProviders
            };
        default:
            return state;
    }
};

export default auth;
