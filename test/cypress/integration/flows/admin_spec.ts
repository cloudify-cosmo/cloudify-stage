// @ts-nocheck File not migrated fully to TS
describe('Admin flow', () => {
    const tenantName = `admin_flow_test_tenant`;
    const groupName = `admin_flow_test_group`;
    const userName = `admin_flow_test_user`;

    before(() => cy.activate().login().deleteAllUsersAndTenants().deleteUserGroup(groupName));

    it('manages groups, tenants and users', () => {
        cy.log('Creating tenant');
        cy.visitPage('System Setup').openTab('Tenant Management');
        cy.contains('.tenantsWidget button', 'Add').click();
        cy.get('.modal input').type(tenantName);
        cy.contains('.modal button', 'Add').click();
        cy.get('.modal').should('not.exist');

        cy.log('Creating group');
        cy.openTab('Groups');
        cy.contains('.userGroupsWidget button', 'Add').click();
        cy.get('input[name=groupName]').type(groupName);
        cy.contains('.modal button', 'Add').click();

        cy.log('Creating user');
        cy.openTab('Users');
        cy.contains('.userManagementWidget button', 'Add').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=username]').type(userName);
            cy.get('input[name=password]').type(userName);
            cy.get('input[name=confirmPassword]').type(userName);
            cy.get('div[name=tenants]').click();
            cy.contains(tenantName).click();
            cy.contains('button', 'Add').click();
        });

        cy.log('Assigning user to group');
        cy.contains('.userManagementWidget tr', userName).find('.content').click();
        cy.contains("Edit user's groups").click();
        cy.get('.modal').within(() => {
            cy.get('div[name=groups]').click();
            cy.contains(groupName).click();
            cy.get('div[name=groups]').blur(); // sometimes it is required to disable focus from `div[name=groups]` that covers `Save` action
            cy.contains('Save').click();
        });
        cy.get('.modal').should('not.exist');

        cy.log('Verifying change is visible across widgets');
        cy.openTab('Tenant Management');
        cy.get('.tenantsWidget').within(() => {
            cy.contains(tenantName).click();
            cy.contains(userName);
        });
        cy.openTab('Groups');
        cy.get('.userGroupsWidget').within(() => {
            cy.contains(groupName).click();
            cy.contains(userName);
        });
    });
});
