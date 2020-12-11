describe('Tenants management widget', () => {
    const tenant = 'tenants_management_test_tenant';
    const group = 'tenants_management_test_group';
    const user = 'tenants_management_test_user';

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('tenants')
            .mockLogin()
            .removeUserGroupFromTenant(group, tenant)
            .removeUserFromTenant(user, tenant)
            .deleteUserGroup(group)
            .deleteTenant(tenant)
            .deleteUser(user)
            .addUserGroup(group)
            .addUser(user, 'admin')
    );

    it('should allow to manage tenants', () => {
        cy.log('Creating new tenant');
        cy.get('.tenantsWidget .add').click();
        cy.get('.modal input').type(tenant);
        cy.get('button.green').click();

        cy.log('Verifying tenant users can be edited');
        cy.contains('tr', tenant).find('.content').click();
        cy.contains('Edit users').click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.contains('.item', user).click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', tenant).contains('.label.blue', '1');

        cy.log('Verifying tenant groups can be edited');
        cy.contains('tr', tenant).find('.content').click();
        cy.contains('Edit user groups').click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.contains('.item', group).click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', tenant).contains('.label.green', '1');

        cy.log('Verifying tenant users and groups can be removed');
        cy.contains('tr', tenant).click();
        cy.get('.remove').click({ multiple: true });
        cy.contains('No groups available');
        cy.contains('No users available');
        cy.contains('tr', tenant).within(() => {
            cy.contains('.label.green', '0');
            cy.contains('.label.blue', '0');

            cy.log('Verifying tenant can be removed');
            cy.get('.content').click();
        });
        cy.contains('Delete').click();
        cy.contains('Yes').click();
        cy.contains(tenant).should('not.exist');
    });
});
