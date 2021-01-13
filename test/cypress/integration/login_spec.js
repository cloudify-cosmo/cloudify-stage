describe('Login', () => {
    it('succeeds when provided credentials are valid and license is active', () => {
        cy.activate().usePageMock().login();

        cy.location('pathname').should('be.equal', '/console/');
    });

    it('fails when provided credentials are valid, license is active but user has no tenants assigned', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: '/console/sp?su=/tenants?_include=name&_get_all_results=true',
            status: 200,
            response: { items: [] }
        });

        cy.activate().login();

        cy.location('pathname').should('be.equal', '/console/noTenants');
        cy.contains('User is not associated with any tenants');
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

    it('fails when provided credentials are invalid', () => {
        cy.login('admin', 'invalid-password');

        cy.get('.error.message').should(
            'have.text',
            'User unauthorized: Authentication failed for user admin. Wrong credentials or locked account'
        );
        cy.location('pathname').should('be.equal', '/console/login');
    });
});
