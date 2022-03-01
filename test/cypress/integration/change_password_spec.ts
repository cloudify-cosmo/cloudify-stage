import Consts from 'app/utils/consts';

describe('Change Password modal', () => {
    before(cy.activate);

    describe('should be available when LDAP is not enabled and', () => {
        const username = 'test_user';
        const password = 'test_user';

        before(() => {
            cy.deleteAllUsersAndTenants()
                .addUser(username, password, true)
                .addUserToTenant(username, Consts.DEFAULT_TENANT, 'manager')
                .usePageMock()
                .mockLogin(username, password);
            cy.contains(username).click({ force: true });
        });

        const openChangePasswordModal = () => {
            cy.contains('Change Password').click({ force: true });
        };

        it('validate password and confirm password fields', () => {
            openChangePasswordModal();

            cy.get('.userPasswordModal').within(() => {
                cy.get('.error.message').should('not.exist');

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

        it('allow to change password for the current user', () => {
            openChangePasswordModal();

            cy.log('Change password');
            cy.get('.userPasswordModal').within(() => {
                cy.get('input[name=password]').clear().type('new-pass');
                cy.get('input[name=confirmPassword]').clear().type('new-pass');
                cy.get('button.ok').click();
            });
            cy.get('.userPasswordModal').should('not.exist');

            cy.log('Logout');
            cy.contains('Logout').click({ force: true });

            cy.log('Login with new password');
            cy.usePageMock().mockLogin(username, 'new-pass');

            cy.get('.error.message').should('not.exist');
            cy.waitUntilLoaded();
        });
    });

    it('should not be available when LDAP is enabled', () => {
        cy.interceptSp('GET', `/ldap`, 'enabled').as('ldap');

        cy.usePageMock().mockLogin();

        cy.contains('admin').click({ force: true });
        cy.contains('Change Password').should('not.exist');
    });
});
