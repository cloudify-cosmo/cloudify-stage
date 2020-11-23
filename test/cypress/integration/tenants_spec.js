import _ from 'lodash';

describe('Tenants menu', () => {
    const user = {
        username: 'default',
        password: 'cypress',
        isAdmin: false,
        tenants: [
            {
                name: 'default_tenant',
                role: 'user',
                pages: [
                    { id: 'adminDash', name: 'Dashboard' },
                    { id: 'blueprint', name: 'Blueprint' },
                    { id: 'blueprints', name: 'Local Blueprints' }
                ]
            },
            {
                name: 'T1',
                role: 'manager',
                pages: [
                    { id: 'adminDash', name: 'Dashboard' },
                    { id: 'blueprints-community', name: 'Local Blueprints' },
                    { id: 'catalog', name: 'Cloudify Catalog' }
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

        cy.server();
        cy.route('/console/widgets/list', []);
    });

    it('should switch template on tenant change', () => {
        function installTemplate(id, tenant) {
            cy.stageRequest('/console/templates', 'POST', {
                body: {
                    id,
                    data: { roles: [tenant.role], tenants: [tenant.name] },
                    pages: _.map(tenant.pages, 'id')
                }
            });
        }

        cy.log('Installing templates');
        installTemplate('templateForViewer', user.tenants[0]);
        installTemplate('templateForManager', user.tenants[1]);

        cy.login(user.username, user.password);

        function verifyTemplate(tenant) {
            cy.get('.tenantsMenu').click().find('.menu').contains(tenant.name).click().waitUntilLoaded();
            tenant.pages.forEach(page => cy.get('.sidebar > .pages').contains(page.name));
        }

        cy.log('Verifying templates');
        verifyTemplate(user.tenants[0]);
        verifyTemplate(user.tenants[1]);
    });
});
