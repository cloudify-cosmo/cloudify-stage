import { ALLOWED_METHODS_OBJECT } from './consts';

export type TenantsRoles = Record<string, { 'tenant-role': string | null; roles: string[] }>;
export type GroupSystemRoles = Record<string, string[]>;
export type AllowedRequestMethod =
    | typeof ALLOWED_METHODS_OBJECT.delete
    | typeof ALLOWED_METHODS_OBJECT.get
    | typeof ALLOWED_METHODS_OBJECT.patch
    | typeof ALLOWED_METHODS_OBJECT.post
    | typeof ALLOWED_METHODS_OBJECT.patch;
export type QueryStringParams = Record<string, any>;
