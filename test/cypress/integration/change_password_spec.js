describe('Change Password modal', () => {
    const username = 'test_user';
    const password = 'test_user';

    const openChangePasswordModal = () => {
        cy.get('.usersMenu')
            .click()
            .contains('Change Password')
            .click();
    };

    before(() => {
        cy.activate()
            .deleteAllUsersAndTenants()
            .addUser(username, password, true)
            .addUserToTenant(username, 'default_tenant', 'manager')
            .login(username, password);
    });

    it('should validate password and confirm password fields', () => {
        openChangePasswordModal();

        cy.get('.userPasswordModal').within(() => {
            cy.get('.error.message').should('not.be.visible');

            cy.get('button.ok').click();
            cy.get('.error.message')
                .should('be.visible')
                .within(() => {
                    cy.get('div').should('have.text', 'Errors in the form');
                    cy.get('ul li:nth-child(1)').should('have.text', 'Please provide user password');
                    cy.get('ul li:nth-child(2)').should('have.text', 'Please provide password confirmation');
                });

            cy.get('input[name=password]').click();
            cy.get('input[name=password]').type('new-pass');
            cy.get('button.ok').click();
            cy.get('.error.message')
                .should('be.visible')
                .within(() => {
                    cy.get('div').should('have.text', 'Errors in the form');
                    cy.get('ul li:nth-child(1)').should('have.text', 'Please provide password confirmation');
                });

            cy.get('input[name=confirmPassword]').click();
            cy.get('input[name=confirmPassword]').type('qwe');
            cy.get('button.ok').click();
            cy.get('.error.message')
                .should('be.visible')
                .within(() => {
                    cy.get('div').should('have.text', 'Errors in the form');
                    cy.get('ul li:nth-child(1)').should('have.text', 'Passwords do not match');
                });

            cy.get('button.cancel').click();
        });
    });

    it('should allow to change password for the current user', () => {
        openChangePasswordModal();

        cy.log('Change password');
        cy.get('.userPasswordModal').within(() => {
            cy.get('input[name=password]')
                .clear()
                .type('new-pass');
            cy.get('input[name=confirmPassword]')
                .clear()
                .type('new-pass');
            cy.get('button.ok').click();
        });
        cy.get('.userPasswordModal').should('not.be.visible');

        cy.log('Logout');
        cy.get('.usersMenu')
            .click()
            .contains('Logout')
            .click();

        cy.log('Login with new password');
        cy.login(username, 'new-pass');

        cy.get('.error.message').should('not.be.visible');
        cy.waitUntilLoaded();
    });

    it('should not be available when LDAP is enabled', () => {
        cy.server();
        cy.route({
            method: 'GET',
            url: `/console/sp/?su=/ldap`,
            response: 'enabled'
        }).as('ldap');

        cy.login();

        cy.get('.usersMenu').click();
        cy.get('#changePasswordMenuItem').should('have.class', 'disabled');

        cy.server({ enable: false });
    });
});
