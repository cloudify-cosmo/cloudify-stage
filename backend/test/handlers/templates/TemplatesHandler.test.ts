import { readdirSync } from 'fs-extra';
import { getRBAC } from 'handler/AuthHandler';
import { getMode } from 'serverSettings';

import { getInitialTemplateId } from 'handler/templates/TemplatesHandler';

jest.mock('fs');
(<jest.Mock>readdirSync).mockReturnValue([]);

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

jest.mock('handler/AuthHandler');
(<jest.Mock>getRBAC).mockResolvedValue(rbac);

jest.mock('serverSettings');

describe('TemplatesHandler', () => {
    describe('allows to select built-in template', () => {
        it('in Premium version', async () => {
            (<jest.Mock>getMode).mockReturnValue('main');

            await expect(
                getInitialTemplateId('default', { sys_admin: ['G1'] }, {}, 'default_tenant', '')
            ).resolves.toEqual('main-sys_admin');

            await expect(getInitialTemplateId('sys_admin', {}, {}, '', '')).resolves.toEqual('main-sys_admin');

            await expect(getInitialTemplateId('default', {}, {}, 'default_tenant', '')).resolves.toEqual(
                'main-default'
            );
        });

        it('in Community version', async () => {
            (<jest.Mock>getMode).mockReturnValue('community');
            await expect(getInitialTemplateId('default', {}, {}, 'default_tenant', '')).resolves.toEqual('community');
        });
    });
});
