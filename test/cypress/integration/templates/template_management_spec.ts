// @ts-nocheck File not migrated fully to TS
import { map } from 'lodash';

describe('Template Management', () => {
    const testTenants = ['T1', 'T2', 'T3'];
    const password = 'cypress';
    const defaultUser = {
        username: 'default',
        password,
        isAdmin: false,
        tenants: [
            { name: 'default_tenant', role: 'user' },
            { name: 'T1', role: 'manager' }
        ],
        pages: ['catalog', 'blueprints']
    };
    const users = [defaultUser];

    const verifyTemplateRow = (id: string, pageIds: string[], roles: string[], tenants: string[]) => {
        cy.contains('tr', id).as('templateRow');
        cy.get('@templateRow').within(() => {
            roles.forEach(role => cy.get(`td:nth-of-type(2)`).should('contain.text', role));
        });

        cy.get('@templateRow').click();
        cy.get('.horizontal > :nth-child(1)').within(() =>
            pageIds.forEach((pageId, index) =>
                cy.get(`.divided > :nth-child(${index + 1})`).should('have.text', pageId)
            )
        );
        cy.get('.horizontal > :nth-child(3)').within(() =>
            tenants.forEach((tenant, index) =>
                cy.get(`.divided > :nth-child(${index + 1})`).should('have.text', tenant === '*' ? 'all' : tenant)
            )
        );

        cy.get('@templateRow').click();
    };
    const verifyPageRow = (index, id: string, name: string) => {
        const pageRow = `.red.segment > .gridTable > :nth-child(2) > .very > tbody > :nth-child(${index})`;
        cy.get(`${pageRow} > :nth-child(1)`).should('have.text', id);
        cy.get(`${pageRow} > :nth-child(2)`).should('have.text', name);
    };

    const getTemplateRow = (templateId: string) =>
        cy
            .get('.blue.segment')
            .should('be.visible', true)
            .within(() => cy.contains(templateId).parent().parent());

    before(() => {
        cy.activate().deleteAllUsersAndTenants().removeUserPages().removeUserTemplates();

        cy.log('Create tenants');
        testTenants.forEach(cy.addTenant);

        cy.log('Create users and add them to tenants');
        users.forEach(user => {
            cy.addUser(user.username, user.password, user.isAdmin);
            if (user.tenants) {
                user.tenants.forEach(tenant => cy.addUserToTenant(user.username, tenant.name, tenant.role));
            }
        });
    });

    it('is available for admin users', () => {
        cy.mockLogin();

        cy.get('.loader').should('be.not.visible');

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();

        cy.location('pathname').should('be.equal', '/console/template_management');

        cy.getTemplates().then(templatesData => {
            const builtInTemplates = templatesData.body.filter(template => !template.custom);

            builtInTemplates.forEach(template => {
                cy.getBuiltInTemplate(template.id).then(templateData => {
                    const builtInTemplate = templateData.body;
                    verifyTemplateRow(
                        template.id,
                        map(builtInTemplate.pages, 'id'),
                        builtInTemplate.roles,
                        builtInTemplate.tenants
                    );
                });
            });
        });

        cy.getPages().then(pagesData => {
            const builtInPages = pagesData.body.filter(page => !page.custom);

            builtInPages.forEach((builtInPage, index) => {
                verifyPageRow(index + 1, builtInPage.id, builtInPage.name);
            });
        });
    });

    it('is not available for non-admin users', () => {
        cy.mockLogin(defaultUser.username, defaultUser.password);

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').should('not.contain', 'Template Management');

        cy.visit('/console/template_management');
        cy.get('div > h2').should('have.text', '404 Page Not Found');
    });

    it('allows admin users to create and modify templates', () => {
        const clickOnHeader = () => cy.get('.modal > .header').click();
        cy.removeUserTemplates().mockLogin();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu').contains('Template Management').click();

        cy.get('.createTemplateButton').click();

        cy.log('Specify template name');
        cy.get('.field > .ui > input').type('Template 1');

        cy.log('Select roles');
        cy.get('.form > :nth-child(2) > .ui').click();
        cy.get('[option-value="user"]').click();
        cy.get('[option-value="viewer"]').click();

        cy.log('Add pages');
        cy.get('.horizontal > :nth-child(1)').within(() => {
            cy.contains('deployment').within(() => cy.get('.add').click());
            cy.contains('plugins').within(() => cy.get('.add').click());
            cy.contains('logs').within(() => cy.get('.add').click());
        });

        cy.log('Create template');
        cy.get('.actions > .ok').click();
        cy.get('.modal').should('not.exist');

        cy.log('Verify template');
        verifyTemplateRow('Template 1', ['deployment', 'plugins', 'logs'], ['user', 'viewer'], ['all']);

        cy.log('Edit template');
        getTemplateRow('Template 1').within(() => cy.get('.edit').click());

        cy.log('Change template name');
        cy.get('.field > .ui > input').clear().type('Another Template');

        cy.log('Add roles');
        cy.get('.form > :nth-child(2) > .multiple .clear').click();
        cy.get('.form > :nth-child(2) > .ui').click();
        cy.get('[option-value="manager"]').click();
        cy.get('[option-value="operations"]').click();
        clickOnHeader();

        cy.log('Select tenants');
        cy.get('.form > :nth-child(3) > .multiple .clear').click();
        cy.get('.form > :nth-child(3) > .ui').click();
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
        cy.get('.modal').should('not.exist');

        cy.log('Verify template changes');
        verifyTemplateRow(
            'Another Template',
            ['deployment', 'plugins', 'tmm'],
            ['manager', 'operations'],
            ['T1', 'T2']
        );

        cy.log('Remove template');
        cy.get('.blue.segment');
        getTemplateRow('Another Template').within(() => cy.get('.remove').click());
        cy.get('.popup button.green').click();
        cy.get('.main .loading').should('not.exist');

        cy.log('Verify template was removed');
        cy.getTemplates().then(
            data => expect(data.body.filter(template => template.id === 'Another Template')).to.be.empty
        );
    });
});
