// @ts-nocheck File not migrated fully to TS

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(username, password, role) {
        return this.toolbox.getManager().doPut('/users', { body: { username, password, role } });
    }

    doSetPassword(username, password) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { body: { password } });
    }

    doSetRole(username, role) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { body: { role } });
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
    }

    doRemoveFromTenant(username, tenantName) {
        return this.toolbox.getManager().doDelete('/tenants/users', { body: { username, tenant_name: tenantName } });
    }

    doHandleTenants(username, tenantsToAdd, tenantsToDelete, tenantsToUpdate) {
        const addActions = _.map(tenantsToAdd, (role, tenantName) =>
            this.toolbox.getManager().doPut('/tenants/users', { body: { username, tenant_name: tenantName, role } })
        );
        const deleteActions = _.map(tenantsToDelete, tenantName =>
            this.toolbox.getManager().doDelete('/tenants/users', { body: { username, tenant_name: tenantName } })
        );
        const updateActions = _.map(tenantsToUpdate, (role, tenantName) =>
            this.toolbox.getManager().doPatch('/tenants/users', { body: { username, tenant_name: tenantName, role } })
        );

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doGetGroups() {
        return this.toolbox.getManager().doGet('/user-groups?_include=name');
    }

    doRemoveFromGroup(username, groupName) {
        return this.toolbox.getManager().doDelete('/user-groups/users', { body: { username, group_name: groupName } });
    }

    doHandleGroups(username, groupsToAdd, groupsToDelete) {
        const addActions = _.map(groupsToAdd, groupName =>
            this.toolbox.getManager().doPut('/user-groups/users', { body: { username, group_name: groupName } })
        );
        const deleteActions = _.map(groupsToDelete, groupName =>
            this.toolbox.getManager().doDelete('/user-groups/users', { body: { username, group_name: groupName } })
        );

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doDelete(username) {
        return this.toolbox.getManager().doDelete(`/users/${username}`);
    }

    doActivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, { body: { action: 'activate' } });
    }

    doDeactivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, { body: { action: 'deactivate' } });
    }

    doSetGettingStartedModalEnabled(username, modalEnabled) {
        // TODO(RD-1874): use common api for backend requests
        return this.toolbox.getManager().doPost(`/users/${username}`, { body: { show_getting_started: modalEnabled } });
    }
}
