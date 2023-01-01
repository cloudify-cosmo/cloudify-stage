import type { EDITION } from '../consts';
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
        permissions: Record<string, string[]>;
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
    role: string;
    active: boolean;
    username: string;

    groups: string[];
    group_system_roles: GroupSystemRoles;

    tenants: TenantsRoles;
    tenant_roles: { direct: Record<string, string>; groups: any };

    first_login_at: string | null;
    last_login_at: string | null;
    is_locked: boolean;
    show_getting_started: boolean;
}

export interface UserGroupResponse {
    ldap_dn: string | null;
    name: string;
    role: string;
    users: string[];
    tenants: Record<string, string>;
    group_system_roles: GroupSystemRoles;
}

export interface LicenseResponse {
    capabilities: string[] | null;
    cloudify_version: string | null;
    customer_id: string;
    expiration_date: string | null;
    expired: boolean;
    license_edition: string;
    trial: boolean;
}
/* eslint-enable camelcase */
