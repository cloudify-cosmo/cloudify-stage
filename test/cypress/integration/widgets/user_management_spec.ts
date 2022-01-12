// @ts-nocheck File not migrated fully to TS
import Consts from 'app/utils/consts';

describe('User management widget', () => {
    const username = 'user_management_test_user';
    const group = 'user_management_test_group';

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('userManagement')
            .mockLogin()
            .deleteUser(username)
            .deleteUserGroup(group)
            .addUserGroup(group)
    );

    it('should allow to manage users', () => {
        cy.log('Creating new user');
        cy.get('.userManagementWidget .add').click();
        cy.get('.modal').within(() => {
            cy.get('input[name=username]').type(username);
            const password = 'admin';
            cy.get('input[name=password]').type(password);
            cy.get('input[name=confirmPassword]').type(password);
            cy.get('.checkbox').click();
            cy.get('button.green').click();
        });

        function verifyCheckbox(name, url, checkedPayload, uncheckedPayload) {
            cy.log(`Verify ${name} checkbox is working`);
            const requestAlias = `${name}ChangeRequest`;
            cy.interceptSp('POST', url).as(requestAlias);
            cy.contains('th', name)
                .invoke('index')
                .then(columnIdx =>
                    cy
                        .contains('tr', username)
                        .find(`td:eq(${columnIdx})`)
                        .within(() => {
                            cy.get('.checkbox').click();
                            cy.wait(`@${requestAlias}`).then(({ request }) =>
                                expect(request.body).to.deep.equal(uncheckedPayload)
                            );
                            cy.get('.checkbox:not(.checked)').click();
                            cy.wait(`@${requestAlias}`).then(({ request }) =>
                                expect(request.body).to.deep.equal(checkedPayload)
                            );
                            cy.get('.checkbox.checked');
                        })
                );
        }

        verifyCheckbox('Admin', `/users/${username}`, { role: 'sys_admin' }, { role: 'default' });
        verifyCheckbox('Active', `/users/active/${username}`, { action: 'activate' }, { action: 'deactivate' });
        verifyCheckbox(
            'Getting started',
            `/users/${username}`,
            { show_getting_started: true },
            { show_getting_started: false }
        );

        cy.log('Verifying password can be changed');
        cy.contains('tr', username).find('.content').click();
        cy.contains('Change password').click();
        const newPassword = 'changed';
        cy.get('input[name=password]').type(newPassword);
        cy.get('input[name=confirmPassword]').type(newPassword);
        cy.contains('button', 'Change').click();

        cy.log('Verifying user groups can be edited');
        cy.contains('tr', username).find('.content').click();
        cy.contains("Edit user's groups").click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.contains('.item', group).click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', username).contains('.label.green', '1');

        cy.log('Verifying user tenants can be edited');
        cy.contains('tr', username).find('.content').click();
        cy.contains("Edit user's tenants").click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.contains('.item', Consts.DEFAULT_TENANT).click();
            cy.contains('Save').click({ force: true });
        });
        cy.contains('tr', username).contains('.label.blue', '1');

        cy.log('Verifying user groups and tenants can be removed');
        cy.contains(username).click();
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
