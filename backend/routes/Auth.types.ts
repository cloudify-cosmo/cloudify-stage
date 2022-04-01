import { EDITION } from '../consts';
import type { GroupSystemRoles, TenantsRoles } from '../types';

/* eslint-disable camelcase */
export interface TokenResponse {
    id: string;
    username: string;
    value: string;
    role: string;
    expiration_date: string;
    last_used: string;
    description: string;
}
/* eslint-enable camelcase */

export interface ConfigResponse {
    metadata: any;
    items: any[];
    authorization: {
        roles: {
            id: number;
            name: string;
            type: string;
            description: string;
        }[];
        permissions: Record<string, string[]>[];
    };
}

export interface VersionResponse {
    edition: typeof EDITION.PREMIUM | typeof EDITION.COMMUNITY;
    version: string;
    build: any;
    date: any;
    commit: any;
    distribution: string;
    // eslint-disable-next-line camelcase
    distro_release: string;
}

/* eslint-disable camelcase */
export interface UserResponse {
    username: string;
    tenants: TenantsRoles;
    tenant_roles: any;
    groups: any;
    role: string;
    group_system_roles: GroupSystemRoles;
    active: boolean;
    first_login_at: string;
    last_login_at: string;
    is_locked: boolean;
    show_getting_started: boolean;
}
/* eslint-enable camelcase */

/* eslint-disable camelcase */
export interface LicenseResponse {
    capabilities: string[] | null;
    cloudify_version: string | null;
    customer_id: string;
    expiration_date: string;
    expired: boolean;
    license_edition: string;
    trial: boolean;
}
/* eslint-enable camelcase */
