describe('Template Management', () => {

    const tenants = [
        'T1', 'T2', 'T3'
    ];
    const password = 'cypress';
    const defaultUser = {
        username: 'default', password, isAdmin: false, tenants: [ { name: 'default_tenant', role: 'user' }, { name: 'T1', role: 'manager' } ],
        pages: [ 'catalog', 'blueprints' ]
    };
    const users = [ defaultUser ];
    const builtInTemplates = [
        {
            id: 'main-default',
            pages: [
                'app', 'catalog', 'blueprints', 'deploy', 'systemResources', 'logs'
            ],
            roles: 'default',
            tenants: [ 'all' ]
        },
        {
            id: 'main-sys_admin',
            pages: [
                'adminDash', 'catalog', 'blueprints', 'deploy', 'tmm', 'ha',
                'systemResources-admin', 'statistics', 'logs'
            ],
            roles: 'sys_admin',
            tenants: [ 'all' ]
        }
    ];
    const builtInPages = [
        { id: 'adminDash', name: 'Dashboard' },
        { id: 'app', name: 'Dashboard' },
        { id: 'blueprint', name: 'Blueprint' },
        { id: 'blueprints-community', name: 'Local Blueprints' },
        { id: 'blueprints', name: 'Local Blueprints' },
        { id: 'catalog-community', name: 'Cloudify Catalog' },
        { id: 'catalog', name: 'Cloudify Catalog' },
        { id: 'deploy', name: 'Deployments' },
        { id: 'deployment', name: 'Deployment' },
        { id: 'execution', name: 'Logs' },
        { id: 'ha', name: 'Admin Operations' },
        { id: 'logs', name: 'Logs' },
        { id: 'plugins', name: 'Plugins' },
        { id: 'statistics', name: 'Statistics' },
        { id: 'systemResources-admin', name: 'System Resources' },
        { id: 'systemResources-community', name: 'System Resources' },
        { id: 'systemResources', name: 'System Resources' },
        { id: 'tmm', name: 'Tenant Management' }
    ];

    const verifyTemplateRow = (index, id, pages, roles, tenants) => {
        const templateRow = `.blue.segment > .gridTable > :nth-child(2) > .very > tbody > :nth-child(${index})`;
        cy.get(`${templateRow} > :nth-child(1)`)
            .should('have.text', id);
        cy.get(`${templateRow} > :nth-child(2)`)
            .should('have.text', roles);

        cy.get(`${templateRow} > :nth-child(1)`)
            .click();
        cy.get('.horizontal > :nth-child(1)')
            .within(() => {
                for (let i = 0; i < pages.length; i++) {
                    cy.get(`.divided > :nth-child(${i + 1})`)
                        .should('have.text', pages[i]);
                }
            });
        cy.get('.horizontal > :nth-child(3)')
            .within(() => {
                for (let i = 0; i < tenants.length; i++) {
                    cy.get(`.divided > :nth-child(${i + 1})`)
                        .should('have.text', tenants[i]);
                }
            });
        cy.get(`${templateRow} > :nth-child(1)`)
            .click();
    };
    const verifyPageRow = (index, id, name) => {
        const pageRow = `.red.segment > .gridTable > :nth-child(2) > .very > tbody > :nth-child(${index})`;
        cy.get(`${pageRow} > :nth-child(1)`)
            .should('have.text', id);
        cy.get(`${pageRow} > :nth-child(2)`)
            .should('have.text', name);
    };

    const getTemplateRow = (templateId) =>
        cy.get('.blue.segment')
            .should('be.visible', true)
            .within(() => cy.contains(templateId).parent().parent());
    const getPageRow = (pageId) =>
        cy.get('.red.segment')
            .should('be.visible', true)
            .within(() => cy.contains(pageId).parent().parent());

    before(() => {
        cy.activate()
            .deleteAllUsersAndTenants()
            .removeUserPages()
            .removeUserTemplates();

        // Create tenants
        for (let tenant of tenants) {
            cy.addTenant(tenant);
        }

        // Create users and add them to tenants
        for (let user of users) {
            cy.addUser(user.username, user.password, user.isAdmin);
            if (!!user.tenants) {
                for (let tenant of user.tenants) {
                    cy.addUserToTenant(user.username, tenant.name, tenant.role);
                }
            }
        }
    });

    it('is available for admin users', () => {
        cy.login();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();

        cy.location('pathname')
            .should('be.equal', '/console/template_management');

        for (let i = 0; i < builtInTemplates.length; i++) {
            verifyTemplateRow(i + 1, builtInTemplates[i].id, builtInTemplates[i].pages, builtInTemplates[i].roles, builtInTemplates[i].tenants);
        }

        for (let i = 0; i < builtInPages.length; i++) {
            verifyPageRow(i + 1, builtInPages[i].id, builtInPages[i].name);
        }
    });

    it('is not available for non-admin users', () => {
        cy.login(defaultUser.username, defaultUser.password);

        cy.get('.usersMenu').click();
        cy.get('.usersMenu')
            .should('not.contain', 'Template Management');

        cy.visit('/console/template_management')
            .waitUntilLoaded();
        cy.get('div > h2')
            .should('have.text', '404 Page Not Found');
    });

    /*it('allows admin users to create and modify pages', () => {
        cy.removeUserPages()
            .login();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();

        cy.get('.createPageButton')
            .click();

        // Specify page name
        cy.get('.field > .ui > input')
            .type('Page 1');

        // Create page
        cy.get('.actions > .ok')
            .click();

        // Add widgets
        cy.get('.editModeSidebar .content > :nth-child(1)')
            .click();
        cy.get('[data-id="agents"]')
            .click();
        cy.get('[data-id="blueprintSources"]')
            .click();
        cy.get('button#addWidgetsBtn')
            .click();

        // Save page
        cy.get('.editModeSidebar .content > :nth-child(2)')
            .click();

        // Verify page
        verifyPageRow(builtInPages.length + 1, 'page_1', 'Page 1');

        // Edit page
        getPageRow('page_1')
            .within(() => cy.get('.edit').click());

        // Verify widgets
        cy.get('.agentsWidget')
            .should('be.visible', true);
        cy.get('.blueprintSourcesWidget')
            .should('be.visible', true);

        // Add more widgets
        cy.get('.editModeSidebar .content > :nth-child(1)')
            .click();
        cy.get('[data-id="plugins"]')
            .click();
        cy.get('[data-id="snapshots"]')
            .click();
        cy.get('button#addWidgetsBtn')
            .click();

        // Save page
        cy.get('.editModeSidebar .content > :nth-child(2)')
            .click();

        // Remove page
        getPageRow('page_1')
            .within(() => cy.get('.remove').click());
        cy.get('.rightFloated > .green')
            .click();
        cy.get('.main .loading')
            .should('be.not.visible', true);

        // Verify page was removed
        cy.getPages()
            .then((data) => expect(data.body.filter(page => page.id === 'page_1')).to.be.empty)
    });*/

    it('allows admin users to create and modify templates', () => {
        cy.removeUserTemplates()
            .login();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();

        cy.get('.createTemplateButton')
            .click();

        // Specify template name
        cy.get('.field > .ui > input')
            .type('Template 1');

        // Select roles
        cy.get('.form > :nth-child(3) > .ui')
            .click();
        cy.get('[option-value="user"]')
            .click();
        cy.get('[option-value="viewer"]')
            .click();

        // Add pages
        cy.get('.horizontal > :nth-child(1)')
            .within(() => {
                cy.contains('deployment').within(() => cy.get('.add').click());
                cy.contains('statistics').within(() => cy.get('.add').click());
                cy.contains('logs').within(() => cy.get('.add').click());
            });

        // Create template
        cy.get('.actions > .ok')
            .click();
        cy.get('.modal')
            .should('not.be.visible', true);

        // Verify template
        verifyTemplateRow(builtInTemplates.length + 1, 'Template 1', ['deployment', 'statistics', 'logs'], 'user, viewer', [ 'all']);

        // Edit template
        getTemplateRow('Template 1')
            .within(() => cy.get('.edit').click());

        // Change template name
        cy.get('.field > .ui > input')
            .clear()
            .type('Another Template');

        // Add roles
        cy.get('.form > :nth-child(3) > .multiple .clear')
            .click();
        cy.get('.form > :nth-child(3) > .ui')
            .click();
        cy.get('[option-value="manager"]')
            .click();
        cy.get('[option-value="operations"]')
            .click();
        // click on header to close roles dropdown
        cy.get('.page > .scrolling > :nth-child(1)')
            .click();

        // Select tenants
        cy.get('.form > :nth-child(4) > .multiple .clear')
            .click();
        cy.get('.form > :nth-child(4) > .ui')
            .click();
        cy.get('[option-value="T1"]')
            .click();
        cy.get('[option-value="T2"]')
            .click();
        // click on header to close tenants dropdown
        cy.get('.page > .scrolling > :nth-child(1)')
            .click();

        // Add pages
        cy.get('.horizontal > :nth-child(1)')
            .within(() => {
                cy.contains('tmm').within(() => cy.get('.add').click());
            });

        // Remove pages
        cy.get('.horizontal > :nth-child(2)')
            .within(() => {
                cy.contains('logs').within(() => cy.get('.minus').click());
            });

        // Save template
        cy.get('.actions > .ok')
            .click();
        cy.get('.modal')
            .should('not.be.visible', true);

        // Verify template changes
        verifyTemplateRow(builtInTemplates.length + 1, 'Another Template', ['deployment', 'statistics', 'tmm'], 'manager, operations', [ 'T1', 'T2' ]);

        // Remove template
        cy.get('.blue.segment');
        getTemplateRow('Another Template')
            .within(() => cy.get('.remove').click());
        cy.get('.rightFloated > .green')
            .click();
        cy.get('.main .loading')
            .should('be.not.visible', true);

        // Verify template was removed
        cy.getTemplates()
            .then((data) => expect(data.body.filter(template => template.id === 'Another Template')).to.be.empty)
    });

    it('allows applying templates for users', () => {
        cy.removeUserTemplates();

        // Install templates
        cy.stageRequest('/console/templates', 'POST', null, {
            id: 'templateForViewer',
            data: { roles: [ defaultUser.tenants[0].role ], tenants: [ defaultUser.tenants[0].name ] },
            pages: [ builtInPages[0].id, builtInPages[2].id, builtInPages[4].id ]
        });
        cy.stageRequest('/console/templates', 'POST', null, {
            id: 'templateForManager',
            data: { roles: [ defaultUser.tenants[1].role ], tenants: [ defaultUser.tenants[1].name ] },
            pages: [ builtInPages[1].id, builtInPages[3].id, builtInPages[5].id ]
        });

        cy.login(defaultUser.username, defaultUser.password);

        // Verify template in first tenant
        cy.get('.tenantsMenu')
            .click()
            .within(() => cy.contains(defaultUser.tenants[0].name).click())
            .waitUntilLoaded();
        for (let page of [ builtInPages[0].name, builtInPages[2].name, builtInPages[4].name ]) {
            cy.get('.sidebar > .pages')
                .within(() => cy.contains(page).should('be.visible', true));
        }

        // Verify template in second tenant
        cy.get('.tenantsMenu')
            .click()
            .within(() => cy.contains(defaultUser.tenants[1].name).click())
            .waitUntilLoaded();
        for (let page of [ builtInPages[1].name, builtInPages[3].name, builtInPages[5].name ]) {
            cy.get('.sidebar > .pages')
                .within(() => cy.contains(page).should('be.visible', true));
        }
    });

});