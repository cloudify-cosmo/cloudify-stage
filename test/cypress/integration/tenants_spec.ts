// @ts-nocheck File not migrated fully to TS
import _ from 'lodash';
import Consts from 'app/utils/consts';

describe('Tenants menu', () => {
    const user = {
        username: 'default',
        password: 'cypress',
        isAdmin: false,
        tenants: [
            {
                name: Consts.DEFAULT_TENANT,
                role: 'user',
                pages: [
                    { id: 'adminDash', name: 'Dashboard' },
                    { id: 'blueprint', name: 'Blueprint' },
                    { id: 'blueprints', name: 'Blueprints' }
                ]
            },
            {
                name: 'T1',
                role: 'manager',
                pages: [
                    { id: 'adminDash', name: 'Dashboard' },
                    { id: 'blueprints-community', name: 'Blueprints' }
                ]
            }
        ]
    };

    before(() => {
        cy.activate().deleteAllUsersAndTenants().removeUserPages().removeUserTemplates();

        cy.log('Creating tenant');
        cy.addTenant('T1');

        cy.log('Creating user');
        cy.addUser(user.username, user.password, user.isAdmin);

        cy.log('Adding user to tenants');
        user.tenants.forEach(tenant => cy.addUserToTenant(user.username, tenant.name, tenant.role));

        cy.intercept('/console/widgets/list', []);
    });

    it('should switch template on tenant change', () => {
        function installTemplate(id, tenant) {
            cy.stageRequest('/console/templates', 'POST', {
                body: {
                    id,
                    data: { roles: [tenant.role], tenants: [tenant.name] },
                    pages: _.map(tenant.pages, page => ({ id: page.id, type: 'page' }))
                }
            });
        }

        cy.log('Installing templates');
        installTemplate('templateForViewer', user.tenants[0]);
        installTemplate('templateForManager', user.tenants[1]);

        cy.mockLogin(user.username, user.password);

        function verifyTemplate(tenant) {
            cy.contains('.dropdown', Consts.DEFAULT_TENANT).click();
            cy.get('.menu').contains(tenant.name).click().waitUntilLoaded();
            tenant.pages.forEach(page => cy.get('.sidebar > .pages').contains(page.name));
        }

        cy.log('Verifying templates');
        verifyTemplate(user.tenants[0]);
        verifyTemplate(user.tenants[1]);
    });

    // TODO(RD-1565): add tests for resetting modal tenant pages
});
