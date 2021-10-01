declare global {
    namespace Express {
        interface User {
            username: string;
            role: string;
            // eslint-disable-next-line camelcase
            group_system_roles: Record<string, any>;
            tenants: Record<string, any>;
        }
    }
}

export {};
