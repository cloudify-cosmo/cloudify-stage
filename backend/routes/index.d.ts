import type { GroupSystemRoles, TenantsRoles } from '../types';

declare global {
    namespace Express {
        interface User {
            username: string;
            role: string;
            // eslint-disable-next-line camelcase
            group_system_roles: GroupSystemRoles;
            tenants: TenantsRoles;
        }
    }
}

export {};
