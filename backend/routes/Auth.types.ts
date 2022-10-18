import type { ConfigResponse, LicenseResponse, UserResponse, VersionResponse } from '../handler/AuthHandler.types';

export interface PostAuthLoginResponse {
    role: string;
}

export type PostAuthSamlCallbackResponse = never;

export interface GetAuthManagerResponse {
    license: LicenseResponse | null;
    version: VersionResponse;
    rbac: ConfigResponse['authorization'];
}

export interface GetAuthUserResponse {
    username: UserResponse['username'];
    role: UserResponse['role'];
    groupSystemRoles: UserResponse['group_system_roles'];
    tenantsRoles: UserResponse['tenants'];
    showGettingStarted: UserResponse['show_getting_started'];
}

export type GetAuthRBACResponse = ConfigResponse['authorization'];

export type GetAuthFirstLoginResponse = boolean;
