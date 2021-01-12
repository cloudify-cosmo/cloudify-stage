const fs = require('fs');

jest.mock('fs');
fs.readdirSync.mockReturnValue([]);

const rbac = {
    roles: [
        {
            type: 'system_role',
            name: 'sys_admin'
        },
        {
            type: 'tenant_role',
            name: 'manager'
        },
        {
            type: 'tenant_role',
            name: 'user'
        },
        {
            type: 'tenant_role',
            name: 'operations'
        },
        {
            type: 'tenant_role',
            name: 'viewer'
        },
        {
            type: 'system_role',
            name: 'default'
        }
    ],
    permissions: {}
};

describe('TemplateHandler', () => {
    describe('allows to select built-in template', () => {
        beforeEach(() => {
            jest.resetModules();
            jest.doMock('handler/AuthHandler', () => ({
                getRBAC: () => Promise.resolve(rbac)
            }));
        });

        it('in Premium version', async () => {
            jest.doMock('serverSettings', () => ({
                MODE_MAIN: 'main',
                settings: {
                    mode: 'main'
                }
            }));
            const TemplateHandler = require('../../handler/TemplateHandler');

            await expect(
                TemplateHandler.selectTemplate('default', { sys_admin: ['G1'] }, {}, 'default_tenant', '')
            ).resolves.toEqual('main-sys_admin');

            await expect(TemplateHandler.selectTemplate('sys_admin', {}, {}, '', '')).resolves.toEqual(
                'main-sys_admin'
            );

            await expect(TemplateHandler.selectTemplate('default', {}, {}, 'default_tenant', '')).resolves.toEqual(
                'main-default'
            );
        });

        it('in Community version', async () => {
            jest.doMock('serverSettings', () => ({
                MODE_MAIN: 'main',
                settings: {
                    mode: 'community'
                }
            }));
            const TemplateHandler = require('../../handler/TemplateHandler');

            await expect(TemplateHandler.selectTemplate('default', {}, {}, 'default_tenant', '')).resolves.toEqual(
                'community'
            );
        });
    });
});
