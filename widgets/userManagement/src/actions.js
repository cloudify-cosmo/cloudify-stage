/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(username, password, role) {
        return this.toolbox.getManager().doPut('/users', null, { username, password, role });
    }

    doSetPassword(username, password) {
        return this.toolbox.getManager().doPost(`/users/${username}`, null, { password });
    }

    doSetRole(username, role) {
        return this.toolbox.getManager().doPost(`/users/${username}`, null, { role });
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
    }

    doRemoveFromTenant(username, tenantName) {
        return this.toolbox.getManager().doDelete('/tenants/users', null, { username, tenant_name: tenantName });
    }

    doHandleTenants(username, tenantsToAdd, tenantsToDelete, tenantsToUpdate) {
        const addActions = _.map(tenantsToAdd, (role, tenantName) =>
            this.toolbox.getManager().doPut('/tenants/users', null, { username, tenant_name: tenantName, role })
        );
        const deleteActions = _.map(tenantsToDelete, tenantName =>
            this.toolbox.getManager().doDelete('/tenants/users', null, { username, tenant_name: tenantName })
        );
        const updateActions = _.map(tenantsToUpdate, (role, tenantName) =>
            this.toolbox.getManager().doPatch('/tenants/users', null, { username, tenant_name: tenantName, role })
        );

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doGetGroups() {
        return this.toolbox.getManager().doGet('/user-groups?_include=name');
    }

    doRemoveFromGroup(username, groupName) {
        return this.toolbox.getManager().doDelete('/user-groups/users', null, { username, group_name: groupName });
    }

    doHandleGroups(username, groupsToAdd, groupsToDelete) {
        const addActions = _.map(groupsToAdd, groupName =>
            this.toolbox.getManager().doPut('/user-groups/users', null, { username, group_name: groupName })
        );
        const deleteActions = _.map(groupsToDelete, groupName =>
            this.toolbox.getManager().doDelete('/user-groups/users', null, { username, group_name: groupName })
        );

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doDelete(username) {
        return this.toolbox.getManager().doDelete(`/users/${username}`);
    }

    doActivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, null, { action: 'activate' });
    }

    doDeactivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, null, { action: 'deactivate' });
    }
}
