describe('Login', () => {
    it('succeeds when provided credentials are valid and license is active', () => {
        cy.activate().usePageMock().login();

        cy.location('pathname').should('be.equal', '/console/');
    });

    it('succeeds and redirects when provided credentials are valid, license is active and redirect query parameter is specified', () => {
        cy.activate();

        const redirectUrl = '/console/page/deployments';
        cy.visit(`/console/login?redirect=${redirectUrl}`);

        cy.usePageMock().login();

        cy.location('pathname').should('be.equal', redirectUrl);
    });

    it('succeeds when provided credentials are valid and license is not active', () => {
        cy.uploadLicense('expired_trial_license').login();

        cy.get('.container h2').should('contain.text', 'License Management');
        cy.location('pathname').should('be.equal', '/console/license');
    });

    it('fails when provided credentials are valid, license is active but user has no tenants assigned', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/console/auth/user',
            status: 200,
            response: { username: 'test', role: 'default', groupSystemRoles: {}, tenantsRoles: {} }
        });

        cy.activate().login();

        cy.location('pathname').should('be.equal', '/console/noTenants');
        cy.contains('User is not associated with any tenants');
    });

    it('fails when provided credentials are invalid', () => {
        cy.login('admin', 'invalid-password', false);

        cy.get('.error.message').should(
            'have.text',
            'User unauthorized: Authentication failed for user admin. Wrong credentials or locked account'
        );
        cy.location('pathname').should('be.equal', '/console/login');
    });

    it('fails when manager data cannot be fetched', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/console/auth/manager',
            status: 500,
            response: {}
        });

        cy.activate().login('admin', 'admin');

        cy.location('pathname').should('be.equal', '/console/error');
        cy.get('.error.message').should('have.text', 'Error getting data from the manager, cannot load page');
    });

    it('fails when user data cannot be fetched', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/console/auth/user',
            status: 500,
            response: {}
        });

        cy.activate().login('admin', 'admin');

        cy.location('pathname').should('be.equal', '/console/error');
        cy.get('.error.message').should('have.text', 'Error initializing user data, cannot load page');
    });
});
