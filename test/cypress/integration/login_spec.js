describe('Login', () => {
    it('succeeds when provided credentials are valid and license is active', () => {
        cy.activate().login();

        cy.location('pathname').should('be.equal', '/console/');
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
            'User unauthorized: Authentication failed for user admin. Bad credentials or locked account'
        );
        cy.location('pathname').should('be.equal', '/console/login');
    });
});
