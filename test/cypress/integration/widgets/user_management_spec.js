describe('User management widget', () => {
    const username = 'user_management_test_user';
    const group = 'user_management_test_group';

    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .deleteUser(username)
            .deleteUserGroup(group)
            .addUserGroup(group)
            .visitPage('Tenant Management')
    );

    it('should allow to manage users', () => {
        cy.log('Creating new user');
        cy.get('.userManagementWidget .add').click();
        cy.get('input[name=username]').type(username);
        const password = 'admin';
        cy.get('input[name=password]').type(password);
        cy.get('input[name=confirmPassword]').type(password);
        cy.get('button.green').click();

        cy.contains('tr', username).within(() => {
            cy.log('Verifying Admin checkbox is working');
            cy.get('td:eq(2)').within(() => {
                cy.get('.checkbox').click();
                cy.get('.checkbox.checked').click();
                cy.get('.checkbox:not(.checked)');
            });

            cy.log('Verifying Active checkbox is working');
            cy.get('td:eq(3)').within(() => {
                cy.get('.checkbox').click();
                cy.get('.checkbox:not(.checked)').click();
                cy.get('.checkbox.checked');
            });
        });

        cy.log('Verifying password can be changed');
        cy.contains('tr', username)
            .find('.content')
            .click();
        cy.contains('Change password').click();
        const newPassword = 'changed';
        cy.get('input[name=password]').type(newPassword);
        cy.get('input[name=confirmPassword]').type(newPassword);
        cy.contains('button', 'Change').click();

        cy.log('Verifying user groups can be edited');
        cy.contains('tr', username)
            .find('.content')
            .click();
        cy.contains("Edit user's groups").click();
        cy.get('.selection').click();
        cy.contains('.modal .item', group).click();
        cy.contains('Save').click({ force: true });
        cy.contains('tr', username).contains('.label.green', '1');

        cy.log('Verifying user tenants can be edited');
        cy.contains('tr', username)
            .find('.content')
            .click();
        cy.contains("Edit user's tenants").click();
        cy.get('.selection').click();
        cy.contains('.modal .item', 'default_tenant').click();
        cy.contains('Save').click({ force: true });
        cy.contains('tr', username).contains('.label.blue', '1');

        cy.log('Verifying user groups and tenants can be removed');
        cy.contains('tr', username).click();
        cy.get('.remove').click({ multiple: true });
        cy.contains('No groups available');
        cy.contains('No tenants available');
        cy.contains('tr', username).within(() => {
            cy.contains('.label.green', '0');
            cy.contains('.label.blue', '0');

            cy.log('Verifying user can be removed');
            cy.get('.content').click();
        });
        cy.contains('Delete').click();
        cy.contains('Yes').click();
        cy.contains('.userManagementWidget tr', username).should('not.exist');
    });
});
