// @ts-nocheck File not migrated fully to TS
describe('User group management widget', () => {
    const groupName = 'user_groups_test';
    const ldapGroupColumnName = 'LDAP group';
    const userGroupsWidgetName = 'userGroups';
    const setLdapAvailibility = (isEnabled: boolean) => {
        const ldapResponse = isEnabled ? 'enabled' : 'disabled';
        cy.intercept('GET', '/console/sp/ldap', ldapResponse);
    };
    const reloadPage = () => {
        cy.usePageMock(userGroupsWidgetName).mockLogin();
    };

    before(() => {
        cy.activate('valid_trial_license').usePageMock(userGroupsWidgetName).mockLogin().deleteUserGroup(groupName);
    });

    it('should allow to manage a group', () => {
        cy.log('Creating new group');
        cy.get('.userGroupsWidget .add').click();
        cy.get('input[name=groupName]').type(groupName);
        cy.get('button.green').click();

        cy.log('Verifying Admin checkbox is working');
        cy.contains('tr', groupName).within(() => {
            cy.get('.checkbox').click();
            cy.get('.checkbox.checked').click();
            cy.get('.checkbox:not(.checked)');
        });

        cy.log('Verifying group users can be edited');
        cy.contains('tr', groupName).find('.content').click();
        cy.contains("Edit group's users").click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.contains('.item', 'admin').click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', groupName).contains('.label.green', '1');

        cy.log('Verifying group tenants can be edited');
        cy.contains('tr', groupName).find('.content').click();
        cy.contains("Edit group's tenants").click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.contains('.item', 'default_tenant').click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', groupName).contains('.label.blue', '1');

        cy.log('Verifying group users and tenants can be removed');
        cy.contains('tr', groupName).click();
        cy.get('.remove').click({ multiple: true });
        cy.contains('No users available');
        cy.contains('No tenants available');
        cy.contains('tr', groupName).within(() => {
            cy.contains('.label.green', '0');
            cy.contains('.label.blue', '0');

            cy.log('Verifying group can be removed');
            cy.get('.content').click();
        });
        cy.contains('Delete').click();
        cy.contains('Yes').click();
        cy.contains('.userGroupsWidget tr', groupName).should('not.exist');
    });

    it('should display LDAP group when LDAP is enabled', () => {
        setLdapAvailibility(true);
        reloadPage();
        cy.contains(ldapGroupColumnName);
    });

    it('should hide LDAP group when LDAP is disabled', () => {
        setLdapAvailibility(false);
        reloadPage();
        cy.contains(ldapGroupColumnName).should('not.exist');
    });
});
