import type { ManagerData } from './managerReducer';

export default {
    auth: {
        username: '',
        role: '',
        groupSystemRoles: {},
        tenantsRoles: {},
        state: 'loggedOut',
        identityProviders: '',
        error: null
    },
    clusterStatus: {},
    lastUpdated: null,
    license: {},
    maintenance: '',
    permissions: {},
    roles: [],
    tenants: {},
    version: {}
} as ManagerData;
