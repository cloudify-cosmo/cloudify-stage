import _ from 'lodash';

describe('User Menu', () => {
    const nonAdminUsername = 'user-menu-test';
    const nonAdminPassword = 'user-menu-test';

    const verifyOptionIsVisible = (selector, expectedName, expectedClasses) => {
        cy.get(selector).within(() => {
            _.words(expectedClasses, className => cy.get('i').should('have.class', className));
            cy.get('span').should('have.text', expectedName);
        });
    };

    const verifyOptionIsNotVisible = selector => {
        cy.get(selector).should('not.be.visible');
    };

    before(() => {
        cy.activate()
            .deleteAllUsersAndTenants()
            .addUser(nonAdminUsername, nonAdminPassword, false)
            .addUserToTenant(nonAdminUsername, 'default_tenant', 'viewer');
    });

    it('should contain options for admin users', () => {
        cy.login().waitUntilLoaded();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu .menu').within(() => {
            verifyOptionIsVisible('#editModeMenuItem', 'Edit Mode', 'configure');
            verifyOptionIsVisible('#templatesMenuItem', 'Template Management', 'layout list');
            verifyOptionIsVisible('#resetMenuItem', 'Reset Templates', 'undo');
            verifyOptionIsVisible('#licenseMenuItem', 'License Management', 'key');
            verifyOptionIsVisible('#changePasswordMenuItem', 'Change Password', 'lock');
            verifyOptionIsVisible('#logoutMenuItem', 'Logout', 'log out');
        });
    });

    it('should contain options for non-admin users', () => {
        cy.login(nonAdminUsername, nonAdminPassword).waitUntilLoaded();

        cy.get('.usersMenu').click();
        cy.get('.usersMenu .menu').within(() => {
            verifyOptionIsNotVisible('#editModeMenuItem');
            verifyOptionIsNotVisible('#templatesMenuItem');
            verifyOptionIsVisible('#resetMenuItem', 'Reset Templates', 'undo');
            verifyOptionIsNotVisible('#licenseMenuItem');
            verifyOptionIsVisible('#changePasswordMenuItem', 'Change Password', 'lock');
            verifyOptionIsVisible('#logoutMenuItem', 'Logout', 'log out');
        });
    });
});
