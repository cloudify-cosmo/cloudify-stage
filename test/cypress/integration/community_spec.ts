describe('Community version', () => {
    before(() => {
        cy.getAdminToken().then(token => {
            cy.intercept('POST', '/console/auth/login', {
                fixture: 'community/login.json',
                headers: {
                    'Set-Cookie': `XSRF-TOKEN=${token}; Path=/`
                }
            });
            cy.intercept('/console/auth/manager', { fixture: 'community/manager.json' });
            cy.intercept('/console/config', { fixture: 'community/config.json' });
            cy.intercept('GET', '/console/contactDetails', { contactDetailsReceived: true });
            cy.usePageMock().login();
        });
    });

    it('should have Community tag in the banner', () => {
        cy.get('.sidebar').contains('Community');
    });

    it('should have limited set of options in Users menu', () => {
        cy.contains('admin').click({ force: true });
        cy.contains('Edit Mode').should('be.visible');
        cy.contains('Reset Templates').should('be.visible');
        cy.contains('Change Password').should('be.visible');
        cy.contains('Logout').should('be.visible');

        cy.contains('License Management').should('not.exist');
        cy.contains('Template Management').should('not.exist');
    });

    it('should have community license in About modal', () => {
        cy.contains('Help').click({ force: true });
        cy.contains('About').click();
        cy.contains('a', 'End User License Agreement').should(
            'have.attr',
            'href',
            'https://cloudify.co/license-community/'
        );
    });

    it('should display contact details modal', () => {
        cy.intercept('GET', '/console/contactDetails', { contactDetailsReceived: false });
        cy.refreshTemplate();

        cy.typeToFieldInput('First name', 'Ja');
        cy.typeToFieldInput('Last name', 'Ma');
        cy.typeToFieldInput('Email address', 'a@o.pl');
        cy.typeToFieldInput('Phone number', '1234');
        cy.contains('Cloudify Hosted Service').click();

        cy.intercept('POST', '/console/contactDetails').as('contactDetailsSubmit');
        cy.clickButton('Continue');
        cy.wait('@contactDetailsSubmit').then(({ request, response }) => {
            expect(request.body).to.deep.equal({
                first_name: 'Ja',
                last_name: 'Ma',
                email: 'a@o.pl',
                phone: '1234',
                is_eula: true
            });
            expect(response?.statusCode).to.equal(200);
        });
        cy.get('.modal').should('not.exist');
    });
});
