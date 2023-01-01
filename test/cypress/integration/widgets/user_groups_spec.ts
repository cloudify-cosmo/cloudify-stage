import Consts from 'app/utils/consts';
import type { IdentityProvider } from 'app/reducers/managerReducer/authReducer';

describe('User group management widget', () => {
    const groupName = 'user_groups_test';
    const ldapGroupColumnName = 'LDAP group';
    const widgetId = 'userGroups';
    const setLdapAvailability = (isEnabled: boolean) => {
        const idpResponse: IdentityProvider = isEnabled ? 'ldap' : 'local';
        cy.intercept('GET', '/console/sp/idp', idpResponse);
    };
    const mockPageAndLogin = () => {
        cy.usePageMock(widgetId).mockLogin();
    };

    before(() => {
        cy.activate('valid_trial_license').deleteUserGroup(groupName);
        return mockPageAndLogin();
    });

    it('should allow to manage a group', () => {
        cy.log('Creating new group');
        cy.get('.userGroupsWidget .add').click();

        cy.get('.modal').within(() => {
            cy.get('input[name=groupName]').type(groupName);
            cy.clickButton('Add');
        });

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
            cy.contains('.item', Consts.DEFAULT_TENANT).click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', groupName).contains('.label.blue', '1');

        cy.log('Verifying group users and tenants can be removed');
        cy.contains('tr td', groupName).click();
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

    it('should display LDAP group column when LDAP is enabled', () => {
        setLdapAvailability(true);
        mockPageAndLogin();
        cy.getWidget(widgetId).contains(ldapGroupColumnName);
    });

    it('should hide LDAP group column when LDAP is disabled', () => {
        setLdapAvailability(false);
        mockPageAndLogin();
        cy.getWidget(widgetId).contains(ldapGroupColumnName).should('not.exist');
    });
});
