/**
 * Created by jakubniezgoda on 03/02/2017.
 */

export default class Actions {

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(groupName, ldapGroup) {
        let params = _.isUndefined(ldapGroup) || _.isEmpty(ldapGroup)
            ? {'group_name': groupName}
            : {'group_name': groupName, 'ldap_group_dn': ldapGroup};

        return this.toolbox.getManager().doPost('/user-groups', null, params);
    }

    doDelete(groupName) {
        return this.toolbox.getManager().doDelete(`/user-groups/${groupName}`);
    }

    doGetUsers() {
        return this.toolbox.getManager().doGet('/users?_include=username');
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet('/tenants?_include=name');
    }

    doAddUserToGroup(username, group_name) {
        return this.toolbox.getManager().doPut('/user-groups/users', null, {username, group_name});
    }

    doRemoveUserFromGroup(username, group_name) {
        return this.toolbox.getManager().doDelete('/user-groups/users', null, {username, group_name});
    }

    doAddTenantToGroup(tenant_name, group_name) {
        return this.toolbox.getManager().doPut('/tenants/user-groups', null, {tenant_name, group_name});
    }

    doRemoveTenantFromGroup(tenant_name, group_name) {
        return this.toolbox.getManager().doDelete('/tenants/user-groups', null, {tenant_name, group_name});
    }

    doHandleUsers(groupName, usersToAdd, usersToDelete) {
        let addActions = _.map(usersToAdd,(username)=> this.doAddUserToGroup(username, groupName));
        let deleteActions = _.map(usersToDelete,(username)=> this.doRemoveUserFromGroup(username, groupName));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doHandleTenants(groupName, tenantsToAdd, tenantsToDelete) {
        let addActions = _.map(tenantsToAdd,(tenant)=> this.doAddTenantToGroup(tenant, groupName));
        let deleteActions = _.map(tenantsToDelete,(tenant)=> this.doRemoveTenantFromGroup(tenant, groupName));

        return Promise.all(_.concat(addActions, deleteActions));
    }
}