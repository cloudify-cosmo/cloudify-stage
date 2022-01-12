import { map } from 'lodash';
import Consts from 'app/utils/consts';

describe('Templates segment', () => {
    const testTenants = ['T1', 'T2', 'T3'];
    const password = 'cypress';
    const defaultUser = {
        username: 'default',
        password,
        isAdmin: false,
        tenants: [
            { name: Consts.DEFAULT_TENANT, role: 'user' },
            { name: 'T1', role: 'manager' }
        ],
        pages: ['catalog', 'blueprints']
    };
    const users = [defaultUser];

    const verifyTemplateRow = (id: string, pageMenuItems: string[], roles: string[], tenants: string[]) => {
        cy.contains('tr', id).as('templateRow');
        cy.get('@templateRow').within(() => {
            roles.forEach(role => cy.get(`td:nth-of-type(2)`).should('contain.text', role));
        });

        cy.get('@templateRow').click();
        cy.get('.horizontal > :nth-child(1)').within(() =>
            pageMenuItems.forEach((pageMenuItemId, index) =>
                cy.get(`.divided > :nth-child(${index + 1})`).should('have.text', pageMenuItemId)
            )
        );
        cy.get('.horizontal > :nth-child(3)').within(() =>
            tenants.forEach((tenant, index) =>
                cy.get(`.divided > :nth-child(${index + 1})`).should('have.text', tenant === '*' ? 'all' : tenant)
            )
        );

        cy.get('@templateRow').click();
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

    it('lists built-in templates', () => {
        cy.mockLogin();

        cy.get('.loader').should('be.not.visible');

        cy.goToTemplateManagement();

        cy.location('pathname').should('be.equal', '/console/template_management');

        cy.getBuiltInTemplateIds().then(builtInTemplateIds =>
            builtInTemplateIds.forEach(templateId => {
                cy.getBuiltInTemplate(templateId).then(templateData => {
                    const builtInTemplate = templateData.body;
                    verifyTemplateRow(
                        templateId,
                        map(builtInTemplate.pages, 'id'),
                        builtInTemplate.roles,
                        builtInTemplate.tenants
                    );
                });
            })
        );
    });

    it('allows users to create and modify templates', () => {
        const clickOnHeader = () => cy.get('.header').click();
        cy.removeUserTemplates().mockLogin();

        cy.goToTemplateManagement();

        cy.get('.createTemplateButton').click();

        cy.get('.modal').within(() => {
            cy.log('Specify template name');
            cy.get('.field > .ui > input').type('Template 1');

            cy.log('Select roles');
            cy.get('.form > :nth-child(2) > .ui').click();
            cy.get('[option-value="user"]').click();
            cy.get('[option-value="viewer"]').click();
            clickOnHeader();

            cy.log('Add page menu items');
            cy.contains('Available pages')
                .click()
                .parent()
                .within(() => {
                    cy.contains('deployment').find('.add').click();
                    cy.contains('plugins').find('.add').click();
                    cy.contains('logs').find('.add').click();
                });
            cy.contains('Available page groups').click().parent().contains('deployments').find('.add').click();

            cy.log('Create template');
            cy.get('.actions > .ok').click();
        });

        cy.get('.modal').should('not.exist');

        cy.log('Verify template');
        verifyTemplateRow('Template 1', ['deployment', 'plugins', 'logs', 'deployments'], ['user', 'viewer'], ['all']);

        cy.log('Edit template');
        getTemplateRow('Template 1').within(() => cy.get('.edit').click());

        cy.get('.modal').within(() => {
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
            cy.contains('Available pages').click().parent().contains('tmm').find('.add').click();

            cy.log('Remove page menu items');
            cy.contains('Selected page menu items').within(() => {
                cy.contains('logs').find('.minus').click();
                cy.contains('deployments').find('.minus').click();
            });

            cy.log('Save template');
            cy.get('.actions > .ok').click();
        });

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
        cy.get('.popup button.green').click({ force: true });
        cy.get('.main .loading').should('not.exist');

        cy.log('Verify template was removed');
        cy.getTemplates().then(
            data =>
                expect(data.body.filter((template: { id: string }) => template.id === 'Another Template')).to.be.empty
        );
    });
});
