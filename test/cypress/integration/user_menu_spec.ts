import _ from 'lodash';

describe('User Menu', () => {
    const nonAdminUsername = 'user-menu-test';
    const nonAdminPassword = 'user-menu-test';
    const defaultTenantName = 'default_tenant';

    const verifyOptionIsVisible = (expectedName: string, expectedClasses: string) => {
        cy.contains('.item', expectedName).within(() => {
            _(expectedClasses)
                .words()
                .forEach(className => cy.get('i').should('have.class', className));
        });
    };

    const verifyOptionIsNotVisible = (optionName: string) => {
        cy.contains(optionName).should('not.exist');
    };

    before(() => {
        cy.activate()
            .deleteAllUsersAndTenants()
            .addUser(nonAdminUsername, nonAdminPassword, false)
            .addUserToTenant(nonAdminUsername, defaultTenantName, 'viewer');
    });

    beforeEach(cy.usePageMock);

    it('should contain options for admin users', () => {
        cy.login();

        cy.contains('admin').click({ force: true });
        verifyOptionIsVisible('Edit Mode', 'edit');
        verifyOptionIsVisible('Template Management', 'layout list');
        verifyOptionIsVisible('Reset Templates', 'undo');
        verifyOptionIsVisible('License Management', 'key');
        verifyOptionIsVisible('Change Password', 'lock');
        verifyOptionIsVisible('Logout', 'log out');
    });

    it('should contain options for non-admin users', () => {
        cy.mockLogin(nonAdminUsername, nonAdminPassword);

        cy.contains(nonAdminUsername).click({ force: true });
        verifyOptionIsNotVisible('Edit Mode');
        verifyOptionIsNotVisible('Template Management');
        verifyOptionIsVisible('Reset Templates', 'undo');
        verifyOptionIsNotVisible('License Management');
        verifyOptionIsVisible('Change Password', 'lock');
        verifyOptionIsVisible('Logout', 'log out');
    });

    it('should fetch tenants on every tenants menu item click', () => {
        const newTenantName = 'Darth_Vader';
        cy.login();

        cy.log('Adding new tenant');
        cy.addTenant(newTenantName);
        cy.contains(defaultTenantName).click();

        cy.log('Showing spinner while fetching data');
        cy.contains('Loading');

        cy.log('New tenant is visible in the dropdown');
        cy.contains(newTenantName);
    });
});
