import _ from 'lodash';
import { addCommands, GetCypressChainableFromCommands } from 'cloudify-ui-common/cypress/support';
import Consts from 'app/utils/consts';

declare global {
    namespace Cypress {
        // NOTE: necessary for extending the Cypress API
        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface Chainable extends GetCypressChainableFromCommands<typeof commands> {}
    }
}

const builtInUsernames = ['admin', 'db_status_reporter', 'broker_status_reporter', 'manager_status_reporter'];

const commands = {
    addTenant: (tenant: string) => cy.cfyRequest(`/tenants/${tenant}`, 'POST'),

    deleteTenant: (tenant: string): Cypress.Chainable => {
        if (tenant !== Consts.DEFAULT_TENANT) {
            cy.cfyRequest(`/tenants/${tenant}`, 'DELETE', null, null, { failOnStatusCode: false });
        }
        return cy;
    },

    addUser: (username: string, password: string, isAdmin: boolean) =>
        cy.cfyRequest('/users', 'PUT', null, {
            username,
            password,
            role: isAdmin ? 'sys_admin' : 'default'
        }),

    addUserToTenant: (username: string, tenant: string, role: string) =>
        cy.cfyRequest('/tenants/users', 'PUT', null, {
            username,
            tenant_name: tenant,
            role
        }),

    removeUserFromTenant: (username: string, tenant: string): Cypress.Chainable => {
        if (tenant !== Consts.DEFAULT_TENANT || !_.includes(builtInUsernames, username)) {
            return cy.cfyRequest(
                '/tenants/users',
                'DELETE',
                null,
                {
                    username,
                    tenant_name: tenant
                },
                { failOnStatusCode: false }
            );
        }
        return cy;
    },

    removeUserGroupFromTenant: (groupName: string, tenant: string): Cypress.Chainable => {
        if (tenant !== Consts.DEFAULT_TENANT) {
            return cy.cfyRequest(
                '/tenants/user-groups',
                'DELETE',
                null,
                {
                    group_name: groupName,
                    tenant_name: tenant
                },
                { failOnStatusCode: false }
            );
        }
        return cy;
    },

    deleteUser: (username: string): Cypress.Chainable => {
        if (!_.includes(builtInUsernames, username)) {
            return cy.cfyRequest(`/users/${username}`, 'DELETE', null, null, { failOnStatusCode: false });
        }
        return cy;
    },

    deleteAllUsersAndTenants: () =>
        cy.cfyRequest('/users?_get_data=true').then(response => {
            const users = response.body.items;
            users.forEach((user: { tenants: string[]; username: string; groups: string[] }) => {
                const tenants = Object.keys(user.tenants);
                tenants.forEach(tenant => cy.removeUserFromTenant(user.username, tenant));
                user.groups.forEach((groupName: string) =>
                    cy.cfyRequest('/user-groups/users', 'DELETE', null, {
                        group_name: groupName,
                        ..._.pick(user, 'username')
                    })
                );
                cy.deleteUser(user.username);
            });
            cy.cfyRequest('/tenants?_include=name').then(tenantsResponse => {
                const tenants: { name: string }[] = tenantsResponse.body.items;
                tenants.forEach(tenant => cy.deleteTenant(tenant.name));
            });
        }),

    deleteUserGroup: (groupName: string) =>
        cy.cfyRequest(`/user-groups/${groupName}`, 'DELETE', null, null, { failOnStatusCode: false }),

    addUserGroup: (groupName: string) =>
        cy.cfyRequest('/user-groups', 'POST', null, {
            group_name: groupName
        })
};

addCommands(commands);
