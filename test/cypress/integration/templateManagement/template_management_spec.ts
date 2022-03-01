import Consts from 'app/utils/consts';

describe('Template management', () => {
    const nonAdminUser = {
        username: 'default',
        password: 'cypress'
    };

    before(() => {
        cy.activate().deleteAllUsersAndTenants().removeUserPages().removeUserTemplates();

        cy.log('Create non-admin user');
        cy.addUser(nonAdminUser.username, nonAdminUser.password, false);
        cy.addUserToTenant(nonAdminUser.username, Consts.DEFAULT_TENANT, 'user');
    });

    it('is not available for non-admin users', () => {
        cy.mockLoginWithoutWaiting(nonAdminUser);

        cy.visit('/console/template_management');
        cy.waitUntilLoaded();
        cy.get('div > h2').should('have.text', '404 Page Not Found');
    });

    it('is available for admin users', () => {
        cy.mockLogin();

        cy.goToTemplateManagement();

        cy.location('pathname').should('be.equal', '/console/template_management');

        cy.contains('.section', 'Template management');

        cy.contains('.segment', 'Templates');
        cy.contains('.segment', 'Pages');
        cy.contains('.segment', 'Page groups');

        cy.contains('Close').click();
        cy.location('pathname').should('be.equal', '/console/page/dashboard');
    });
});
