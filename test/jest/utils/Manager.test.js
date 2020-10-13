import configureMockStore from 'redux-mock-store';
import Manager from 'utils/Manager';

const mockStore = configureMockStore();

describe('(Utils) Manager', () => {
    const initialState = {
        manager: {
            username: 'admin',
            auth: {
                role: 'sys_admin',
                groupSystemRoles: {},
                tenantsRoles: {
                    default_tenant: {
                        'tenant-role': 'user',
                        roles: ['user']
                    }
                }
            },
            tenants: {
                isFetching: false,
                items: [
                    {
                        name: 'default_tenant'
                    }
                ],
                selected: 'default_tenant',
                lastUpdated: 1602478990905
            },
            version: {
                edition: 'premium',
                version: '5.1.0',
                build: null,
                date: null,
                commit: null,
                distribution: 'centos',
                distro_release: 'Core'
            },
            roles: [
                {
                    name: 'sys_admin',
                    type: 'system_role',
                    description: 'User that can manage Cloudify'
                },
                {
                    name: 'manager',
                    type: 'tenant_role',
                    description: 'User that can manage tenants'
                },
                {
                    name: 'user',
                    type: 'tenant_role',
                    description: 'Regular user, can perform actions on tenants resources'
                },
                {
                    name: 'operations',
                    type: 'tenant_role',
                    description: 'User that can deploy and execute workflows, but cannot manage blueprints or plugins.'
                },
                {
                    name: 'viewer',
                    type: 'tenant_role',
                    description: 'User that can only view tenant resources'
                },
                {
                    name: 'default',
                    type: 'system_role',
                    description: 'User exists, but have no permissions'
                }
            ]
        }
    };

    const store = mockStore(initialState);
    const manager = new Manager(store.getState().manager);

    it('allows to get current user username', () => {
        expect(manager.getCurrentUsername()).toEqual('admin');
    });

    it('allows to get current user role', () => {
        expect(manager.getCurrentUserRole()).toEqual('sys_admin');
    });

    it('allows to get distribution name', () => {
        expect(manager.getDistributionName()).toEqual('centos');
    });

    it('allows to get distribution release', () => {
        expect(manager.getDistributionRelease()).toEqual('Core');
    });

    it('allows to check if in Community edition', () => {
        expect(manager.isCommunityEdition()).toEqual(false);
    });

    describe('allows to build Manager URL', () => {
        it('with [manager] token with data', () => {
            expect(
                manager.getManagerUrl('[manager]/blueprints', {
                    id: 'nodecellar',
                    _include: ['id', 'created_at']
                })
            ).toEqual('?id=nodecellar&_include=id&_include=created_at&su=%252Fblueprints');
            expect(
                manager.getManagerUrl('[manager]/blueprints?', {
                    id: 'nodecellar',
                    _include: ['id', 'created_at']
                })
            ).toEqual('?id=nodecellar&_include=id&_include=created_at&su=%252Fblueprints%253F');
            expect(
                manager.getManagerUrl('[manager]/blueprints?created_by=admin', {
                    id: 'nodecellar',
                    _include: ['id', 'created_at']
                })
            ).toEqual('?id=nodecellar&_include=id&_include=created_at&su=%252Fblueprints%253Fcreated_by%253Dadmin');
        });

        it('with [manager] token without data', () => {
            expect(manager.getManagerUrl('[manager]/blueprints')).toEqual('?su=%252Fblueprints');
        });

        it('without [manager] token with data', () => {
            expect(
                manager.getManagerUrl('/blueprints', {
                    id: 'nodecellar',
                    _include: ['id', 'created_at']
                })
            ).toEqual('/console/sp?su=%2Fblueprints%3Fid%3Dnodecellar%26_include%3Did%26_include%3Dcreated_at');
            expect(
                manager.getManagerUrl('/blueprints?', {
                    id: 'nodecellar',
                    _include: ['id', 'created_at']
                })
            ).toEqual('/console/sp?su=%2Fblueprints%3F%26id%3Dnodecellar%26_include%3Did%26_include%3Dcreated_at');
            expect(
                manager.getManagerUrl('/blueprints?created_by=admin', {
                    id: 'nodecellar',
                    _include: ['id', 'created_at']
                })
            ).toEqual(
                '/console/sp?su=%2Fblueprints%3Fcreated_by%3Dadmin%26id%3Dnodecellar%26_include%3Did%26_include%3Dcreated_at'
            );
        });

        it('without [manager] token without data', () => {
            expect(manager.getManagerUrl('/blueprints')).toEqual('/console/sp?su=%2Fblueprints');
        });
    });

    it('allows to get selected tenant', () => {
        expect(manager.getSelectedTenant()).toEqual('default_tenant');
    });

    it('allows to get system roles', () => {
        expect(manager.getSystemRoles()).toEqual([
            { description: 'User that can manage Cloudify', name: 'sys_admin', type: 'system_role' },
            { description: 'User exists, but have no permissions', name: 'default', type: 'system_role' }
        ]);
    });
});
