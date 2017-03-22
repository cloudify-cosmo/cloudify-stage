/**
 * Created by pposel on 31/01/2016.
 */

export default class Actions {

    static USER_ROLE = "user";
    static ADMIN_ROLE = "admin";

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(username, password, role) {
        return this.toolbox.getManager().doPut('/users', null, {username, password, role});
    }

    doSetPassword(username, password) {
        return this.toolbox.getManager().doPost(`/users/${username}`, null, {password});
    }

    doSetRole(username, role) {
        return this.toolbox.getManager().doPost(`/users/${username}`, null, {role});
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet(`/tenants?_include=name`);
    }

    doRemoveFromTenant(username, tenant_name) {
        return this.toolbox.getManager().doDelete(`/tenants/users`, null, {username, tenant_name});
    }

    doHandleTenants(username, tenantsToAdd, tenantsToDelete) {
        let addActions = _.map(tenantsToAdd,(tenant_name)=> this.toolbox.getManager().doPut(`/tenants/users`, null, {username, tenant_name}));
        let deleteActions = _.map(tenantsToDelete,(tenant_name)=> this.toolbox.getManager().doDelete(`/tenants/users`, null, {username, tenant_name}));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doGetGroups() {
        return this.toolbox.getManager().doGet(`/user-groups?_include=name`);
    }

    doRemoveFromGroup(username, group_name) {
        return this.toolbox.getManager().doDelete(`/user-groups/users`, null, {username, group_name});
    }

    doHandleGroups(username, groupsToAdd, groupsToDelete) {
        let addActions = _.map(groupsToAdd,(group_name)=> this.toolbox.getManager().doPut(`/user-groups/users`, null, {username, group_name}));
        let deleteActions = _.map(groupsToDelete,(group_name)=> this.toolbox.getManager().doDelete(`/user-groups/users`, null, {username, group_name}));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doDelete(username) {
        return this.toolbox.getManager().doDelete(`/users/${username}`);
    }

    doActivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`,null, {action: "activate"} );
    }

    doDeactivate(username) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`,null, {action: "deactivate"} );
    }

}