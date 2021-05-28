/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(username, password, role) {
        return this.toolbox.getManager().doPut('/users', { data: { username, password, role } });
    }

    doSetPassword(username, password) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { data: { password } });
    }

    doSetRole(username, role) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { data: { role } });
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
    }

    doRemoveFromTenant(username, tenantName) {
        return this.toolbox.getManager().doDelete('/tenants/users', { data: { username, tenant_name: tenantName } });
    }

    doHandleTenants(username, tenantsToAdd, tenantsToDelete, tenantsToUpdate) {
        const addActions = _.map(tenantsToAdd, (role, tenantName) =>
            this.toolbox.getManager().doPut('/tenants/users', { data: { username, tenant_name: tenantName, role } })
        );
        const deleteActions = _.map(tenantsToDelete, tenantName =>
            this.toolbox.getManager().doDelete('/tenants/users', { data: { username, tenant_name: tenantName } })
        );
        const updateActions = _.map(tenantsToUpdate, (role, tenantName) =>
            this.toolbox.getManager().doPatch('/tenants/users', { username, tenant_name: tenantName, role })
        );

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doGetGroups() {
        return this.toolbox.getManager().doGet('/user-groups?_include=name');
    }

    doRemoveFromGroup(username, groupName) {
        return this.toolbox.getManager().doDelete('/user-groups/users', { data: { username, group_name: groupName } });
    }

    doHandleGroups(username, groupsToAdd, groupsToDelete) {
        const addActions = _.map(groupsToAdd, groupName =>
            this.toolbox.getManager().doPut('/user-groups/users', { data: { username, group_name: groupName } })
        );
        const deleteActions = _.map(groupsToDelete, groupName =>
            this.toolbox.getManager().doDelete('/user-groups/users', { data: { username, group_name: groupName } })
        );

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doDelete(username) {
        return this.toolbox.getManager().doDelete(`/users/${username}`);
    }

    doActivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, { data: { action: 'activate' } });
    }

    doDeactivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, { data: { action: 'deactivate' } });
    }

    doSetGettingStartedModalEnabled(username, modalEnabled) {
        // TODO(RD-1874): use common api for backend requests
        return this.toolbox.getManager().doPost(`/users/${username}`, { data: { show_getting_started: modalEnabled } });
    }
}
