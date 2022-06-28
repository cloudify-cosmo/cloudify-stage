import type { ManagerData } from './managerReducer';

export default {
    auth: {
        username: '',
        role: '',
        groupSystemRoles: {},
        tenantsRoles: {},
        state: 'loggedOut',
        identityProviders: ['local'],
        error: null,
        showGettingStarted: true
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
