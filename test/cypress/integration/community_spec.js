describe('Community version', () => {
    before(() => {
        cy.activate().then(token => {
            cy.server();
            cy.route({
                method: 'POST',
                url: '/console/auth/login',
                response: 'fixture:community/login.json',
                headers: {
                    'Set-Cookie': `XSRF-TOKEN=${token}; Path=/`
                }
            });
            cy.route('/console/config', 'fixture:community/config.json');
            cy.login();
        });
    });

    it('should have Community tag in the banner', () => {
        cy.get('.headerBar .label').should('have.text', 'Community');
    });

    it('should have limited set of options in Users menu', () => {
        cy.get('.usersMenu')
            .click()
            .within(() => {
                cy.contains('Edit Mode').should('be.visible');
                cy.contains('Reset Templates').should('be.visible');
                cy.contains('Change Password').should('be.visible');
                cy.contains('Logout').should('be.visible');

                cy.contains('License Management').should('not.exist');
                cy.contains('Template Management').should('not.exist');
            });
    });

    it('should have community license in About modal', () => {
        cy.get('.helpMenu')
            .click()
            .contains('About')
            .click();
        cy.contains('a', 'End User License Agreement').should(
            'have.attr',
            'href',
            'https://cloudify.co/license-community/'
        );
    });
});
