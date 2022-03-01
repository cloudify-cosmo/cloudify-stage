import _ from 'lodash';
import Consts from 'app/utils/consts';

describe('User Menu', () => {
    const nonAdminUsername = 'user-menu-test';
    const nonAdminPassword = 'user-menu-test';
    const newTenantName = 'Darth_Vader';

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

    const delayTenantsRefresh = (delayTime: number) => {
        cy.intercept(
            { pathname: '/console/sp/tenants', query: { _include: 'name', _get_all_results: 'true' } },
            request => {
                request.on('response', response => {
                    response.setDelay(delayTime);
                });
            }
        );
    };

    before(() => {
        cy.activate()
            .deleteAllUsersAndTenants()
            .addUser(nonAdminUsername, nonAdminPassword, false)
            .addUserToTenant(nonAdminUsername, Consts.DEFAULT_TENANT, 'viewer');
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
        cy.login();

        cy.log('Adding new tenant');
        cy.addTenant(newTenantName);
        delayTenantsRefresh(250);
        cy.contains(Consts.DEFAULT_TENANT).click();

        cy.contains('Tenant selection')
            .parent()
            .within(() => {
                cy.log('Showing spinner while fetching data');
                cy.contains('Loading');

                cy.log('New tenant is visible in the dropdown');
                cy.contains(newTenantName);
            });
    });
});
