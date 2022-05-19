import Consts from 'app/utils/consts';

describe('Change Password modal', () => {
    const username = 'test_user';
    const password = 'test_user';

    before(() =>
        cy
            .activate()
            .deleteAllUsersAndTenants()
            .addUser(username, password, true)
            .addUserToTenant(username, Consts.DEFAULT_TENANT, 'manager')
    );

    function openUserMenu(user: string) {
        cy.contains(user).click({ force: true });
    }

    describe('when external IDP is enabled', () => {
        beforeEach(() => cy.interceptSp('GET', '/idp', 'okta'));

        it('should not be available when user is not default admin', () => {
            cy.usePageMock().mockLogin({ username, password });

            openUserMenu(username);

            cy.contains('Change Password').should('not.exist');
        });

        it('should be available when user is default admin', () => {
            cy.usePageMock().mockLogin();

            openUserMenu('admin');

            cy.contains('Change Password');
        });
    });

    describe('when external IDP is not enabled should be available and', () => {
        before(() => {
            cy.usePageMock().mockLogin({ username, password });
            openUserMenu(username);
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
            cy.usePageMock().mockLogin({ username, password: 'new-pass' });

            cy.get('.error.message').should('not.exist');
            cy.waitUntilLoaded();
        });
    });
});
