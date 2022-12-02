import Consts from 'app/utils/consts';
import type { PostAuthUsersInviteRequestBody } from 'widgets/userManagement/src/authServiceActions';

describe('User management widget', () => {
    const widgetId = 'userManagement';
    const username = 'user_management_test_user';
    const group = 'user_management_test_group';

    function clickUserMenu(user: string) {
        cy.contains('tr', user).find('.content').click();
    }

    before(() => cy.activate());

    beforeEach(() => cy.deleteUser(username));

    describe('when authentication service is not available', () => {
        it('should allow to manage users', () => {
            cy.deleteUserGroup(group).addUserGroup(group).usePageMock(widgetId).mockLogin();

            cy.log('Creating new user');
            cy.get('.userManagementWidget .add').click();
            cy.get('.modal').within(() => {
                cy.get('input[name=username]').type(username);
                const password = 'admin';
                cy.get('input[name=password]').type(password);
                cy.get('input[name=confirmPassword]').type(password);
                cy.get('.checkbox').click();
                cy.clickButton('Add');
            });

            function verifyCheckbox(name: string, url: string, checkedPayload: any, uncheckedPayload: any) {
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
            clickUserMenu(username);
            cy.contains('Change password').click();
            const newPassword = 'changed';
            cy.get('input[name=password]').type(newPassword);
            cy.get('input[name=confirmPassword]').type(newPassword);
            cy.contains('button', 'Change').click();

            cy.log('Verifying user groups can be edited');
            clickUserMenu(username);
            cy.contains("Edit user's groups").click();
            cy.get('.modal').within(() => {
                cy.get('.selection').click();
                cy.contains('.item', group).click();
                cy.contains('Save').click({ force: true });
            });
            cy.contains('tr', username).contains('.label.green', '1');

            cy.log('Verifying user tenants can be edited');
            clickUserMenu(username);
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

        it('should restrict password changing when external IDP is enabled', () => {
            cy.intercept('GET', '/console/sp/idp', 'okta');
            cy.addUser(username, 'test_password', false).usePageMock(widgetId).mockLogin();

            clickUserMenu('admin');
            cy.contains('Change password');
            clickUserMenu('admin');

            clickUserMenu(username);
            cy.contains('Change password').should('not.exist');
        });
    });

    describe('when authentication service is available', () => {
        function verifyEmailFieldError() {
            cy.contains('Please provide valid e-mail');
            cy.get('.error.message').get('.close.icon').click();
        }

        function typeEmail(email: string) {
            cy.getField('E-mail').find('input').clear().type(email);
        }

        it('should allow to invite users', () => {
            cy.intercept('GET', '/auth/users/me', {
                email: 'moomin@moominvalley.fi',
                selected_manager_address: 'moominpappa.moominvalley.fi',
                status: 'active'
            });

            cy.intercept('POST', '/auth/users/invite', {
                statusCode: 204
            }).as('postUsersInvite');

            const invitedUserEmail = 'groke@moominvalley.fi';

            cy.usePageMock(widgetId).mockLogin();

            cy.clickButton('Invite');

            cy.contains('.modal', 'Invite user').within(() => {
                cy.clickButton('Invite');
                verifyEmailFieldError();

                typeEmail('invalid-email');
                cy.clickButton('Invite');
                verifyEmailFieldError();

                typeEmail(invitedUserEmail);

                cy.contains('Admin').click();

                cy.setMultipleDropdownValues('Tenants', [Consts.DEFAULT_TENANT]);
                cy.setSingleDropdownValue('Choose a role for tenant default_tenant:', 'operations');

                cy.clickButton('Invite');
                cy.wait('@postUsersInvite').then(({ request }) => {
                    expect(request.body).to.deep.equal({
                        email: invitedUserEmail,
                        role_name: Consts.ROLE.SYS_ADMIN,
                        tenants: [{ role_name: 'operations', tenant_name: Consts.DEFAULT_TENANT }]
                    } as PostAuthUsersInviteRequestBody);
                });
            });

            cy.contains('.modal', 'Invite user').should('not.exist');
        });
    });
});
