import _ from 'lodash';

const builtInUsernames = ['admin', 'db_status_reporter', 'broker_status_reporter', 'manager_status_reporter'];

Cypress.Commands.add('addTenant', tenant => cy.cfyRequest(`/tenants/${tenant}`, 'POST'));

Cypress.Commands.add('deleteTenant', tenant => {
    if (tenant !== 'default_tenant') {
        cy.cfyRequest(`/tenants/${tenant}`, 'DELETE');
    }
});

Cypress.Commands.add('addUser', (username, password, isAdmin) =>
    cy.cfyRequest('/users', 'PUT', null, {
        username,
        password,
        role: isAdmin ? 'sys_admin' : 'default'
    })
);

Cypress.Commands.add('addUserToTenant', (username, tenant, role) =>
    cy.cfyRequest('/tenants/users', 'PUT', null, {
        username,
        tenant_name: tenant,
        role
    })
);

Cypress.Commands.add('removeUserFromTenant', (username, tenant) => {
    if (tenant !== 'default_tenant' || !_.includes(builtInUsernames, username)) {
        cy.cfyRequest('/tenants/users', 'DELETE', null, {
            username,
            tenant_name: tenant
        });
    }
});

Cypress.Commands.add('deleteUser', username => {
    if (!_.includes(builtInUsernames, username)) {
        cy.cfyRequest(`/users/${username}`, 'DELETE');
    }
});

Cypress.Commands.add('deleteAllUsersAndTenants', () => {
    cy.cfyRequest('/users?_get_data=true').then(response => {
        for (const user of response.body.items) {
            for (const tenant of Object.keys(user.tenants)) {
                cy.removeUserFromTenant(user.username, tenant);
            }
            cy.deleteUser(user.username);
        }
        cy.cfyRequest('/tenants?_include=name').then(response => {
            for (const tenant of response.body.items) {
                cy.deleteTenant(tenant.name);
            }
        });
    });
});
