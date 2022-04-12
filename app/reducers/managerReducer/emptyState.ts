import type { ManagerData } from './managerReducer';

export default {
    auth: {
        username: '',
        role: '',
        groupSystemRoles: {},
        tenantsRoles: {},
        state: 'loggedOut',
        error: null
    },
    clusterStatus: {},
    isLdapEnabled: false,
    lastUpdated: null,
    license: {},
    maintenance: '',
    permissions: {},
    roles: [],
    tenants: {},
    version: {}
} as ManagerData;
