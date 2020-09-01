describe('Template Management', () => {
    const tenants = ['T1', 'T2', 'T3'];
    const password = 'cypress';
    const defaultUser = {
        username: 'default',
        password,
        isAdmin: false,
        tenants: [{ name: 'default_tenant', role: 'user' }, { name: 'T1', role: 'manager' }],
        pages: ['catalog', 'blueprints']
    };
    const users = [defaultUser];
    const builtInTemplates = [
        {
            id: 'main-default',
            pages: ['app', 'catalog', 'blueprints', 'deploy', 'sites', 'systemResources', 'logs'],
            roles: 'default',
            tenants: ['all']
        },
        {
            id: 'main-sys_admin',
            pages: ['adminDash', 'catalog', 'blueprints', 'deploy', 'sites', 'tmm', 'ha', 'systemResources', 'logs'],
            roles: 'sys_admin',
            tenants: ['all']
        }
    ];
    const builtInPages = [
        { id: 'adminDash', name: 'Dashboard' },
        { id: 'app', name: 'Dashboard' },
        { id: 'blueprint', name: 'Blueprint' },
        { id: 'blueprints-community', name: 'Local Blueprints' },
        { id: 'blueprints', name: 'Local Blueprints' },
        { id: 'catalog', name: 'Cloudify Catalog' },
        { id: 'deploy', name: 'Deployments' },
        { id: 'deployment', name: 'Deployment' },
        { id: 'execution', name: 'Logs' },
        { id: 'ha', name: 'Admin Operations' },
        { id: 'logs', name: 'Logs' },
        { id: 'plugins', name: 'Plugins' },
        { id: 'sites', name: 'Site Management' },
        { id: 'systemResources', name: 'System Resources' },
        { id: 'tmm', name: 'Tenant Management' }
    ];

    const verifyTemplateRow = (index, id, pages, roles, tenants) => {
        const templateRow = `.blue.segment > .gridTable > :nth-child(2) > .very > tbody > :nth-child(${index})`;
        cy.get(`${templateRow} > :nth-child(1)`).should('have.text', id);
        cy.get(`${templateRow} > :nth-child(2)`).should('have.text', roles);

        cy.get(`${templateRow} > :nth-child(1)`).click();
        cy.get('.horizontal > :nth-child(1)').within(() => {
            for (let i = 0; i < pages.length; i++) {
                cy.get(`.divided > :nth-child(${i + 1})`).should('have.text', pages[i]);
            }
        });
        cy.get('.horizontal > :nth-child(3)').within(() => {
            for (let i = 0; i < tenants.length; i++) {
                cy.get(`.divided > :nth-child(${i + 1})`).should('have.text', tenants[i]);
            }
        });
        cy.get(`${templateRow} > :nth-child(1)`).click();
    };
    const verifyPageRow = (index, id, name) => {
        const pageRow = `.red.segment > .gridTable > :nth-child(2) > .very > tbody > :nth-child(${index})`;
        cy.get(`${pageRow} > :nth-child(1)`).should('have.text', id);
        cy.get(`${pageRow} > :nth-child(2)`).should('have.text', name);
    };

    const getTemplateRow = templateId =>
        cy
            .get('.blue.segment')
            .should('be.visible', true)
            .within(() =>
                cy
                    .contains(templateId)
                    .parent()
                    .parent()
            );

    before(() => {
        cy.activate()
            .deleteAllUsersAndTenants()
            .removeUserPages()
            .removeUserTemplates();

        cy.log('Create tenants');
        tenants.forEach(cy.addTenant);

        cy.log('Create users and add them to tenants');
        users.forEach(user => {
            cy.addUser(user.username, user.password, user.isAdmin);
            if (user.tenants) {
                user.tenants.forEach(tenant => cy.addUserToTenant(user.username, tenant.name, tenant.role));
            }
        });
    });

    it('is available for admin users', () => {
        cy.login();

        cy.get('.loader').should('be.not.visible');

        cy.get('.usersMenu').click();
        cy.get('.usersMenu')
            .contains('Template Management')
            .click();

        cy.location('pathname').should('be.equal', '/console/template_management');

        for (let i = 0; i < builtInTemplates.length; i++) {
            verifyTemplateRow(
                i + 1,
                builtInTemplates[i].id,
                builtInTemplates[i].pages,
                builtInTemplates[i].roles,
                builtInTemplates[i].tenants
            );
        }

        for (let i = 0; i < builtInPages.length; i++) {
            verifyPageRow(i + 1, builtInPages[i].id, builtInPages[i].name);
        }
    });

    it('is not available for non-admin users', () => {
        cy.login(defaultUser.username, defaultUser.password);

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').should('not.contain', 'Template Management');

        cy.visit('/console/template_management').waitUntilLoaded();
        cy.get('div > h2').should('have.text', '404 Page Not Found');
    });

    it('allows admin users to create and modify templates', () => {
        const clickOnHeader = () => cy.get('.modal > .header').click();
        cy.removeUserTemplates().login();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu')
            .contains('Template Management')
            .click();

        cy.get('.createTemplateButton').click();

        cy.log('Specify template name');
        cy.get('.field > .ui > input').type('Template 1');

        cy.log('Select roles');
        cy.get('.form > :nth-child(3) > .ui').click();
        cy.get('[option-value="user"]').click();
        cy.get('[option-value="viewer"]').click();

        cy.log('Add pages');
        cy.get('.horizontal > :nth-child(1)').within(() => {
            cy.contains('deployment')
                .get('.add')
                .click();
            cy.contains('plugins')
                .get('.add')
                .click();
            cy.contains('logs')
                .get('.add')
                .click();
        });

        cy.log('Create template');
        cy.get('.actions > .ok').click();
        cy.get('.modal').should('not.be.visible', true);

        cy.log('Verify template');
        verifyTemplateRow(
            builtInTemplates.length + 1,
            'Template 1',
            ['deployment', 'plugins', 'logs'],
            'user, viewer',
            ['all']
        );

        cy.log('Edit template');
        getTemplateRow('Template 1').within(() => cy.get('.edit').click());

        cy.log('Change template name');
        cy.get('.field > .ui > input')
            .clear()
            .type('Another Template');

        cy.log('Add roles');
        cy.get('.form > :nth-child(3) > .multiple .clear').click();
        cy.get('.form > :nth-child(3) > .ui').click();
        cy.get('[option-value="manager"]').click();
        cy.get('[option-value="operations"]').click();
        clickOnHeader();

        cy.log('Select tenants');
        cy.get('.form > :nth-child(4) > .multiple .clear').click();
        cy.get('.form > :nth-child(4) > .ui').click();
        cy.get('[option-value="T1"]').click();
        cy.get('[option-value="T2"]').click();
        clickOnHeader();

        cy.log('Add pages');
        cy.get('.horizontal > :nth-child(1)').within(() => {
            cy.contains('tmm').within(() => cy.get('.add').click());
        });

        cy.log('Remove pages');
        cy.get('.horizontal > :nth-child(2)').within(() => {
            cy.contains('logs').within(() => cy.get('.minus').click());
        });

        cy.log('Save template');
        cy.get('.actions > .ok').click();
        cy.get('.modal').should('not.be.visible', true);

        cy.log('Verify template changes');
        verifyTemplateRow(
            builtInTemplates.length + 1,
            'Another Template',
            ['deployment', 'plugins', 'tmm'],
            'manager, operations',
            ['T1', 'T2']
        );

        cy.log('Remove template');
        cy.get('.blue.segment');
        getTemplateRow('Another Template').within(() => cy.get('.remove').click());
        cy.get('.popup button.green').click();
        cy.get('.main .loading').should('be.not.visible', true);

        cy.log('Verify template was removed');
        cy.getTemplates().then(
            data => expect(data.body.filter(template => template.id === 'Another Template')).to.be.empty
        );
    });
});
