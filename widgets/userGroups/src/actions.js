/**
 * Created by jakubniezgoda on 03/02/2017.
 */

export default class Actions {

    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(groupName, ldapGroup, role) {
        let params = _.isUndefined(ldapGroup) || _.isEmpty(ldapGroup)
            ? {'group_name': groupName, role}
            : {'group_name': groupName, 'ldap_group_dn': ldapGroup, role};

        return this.toolbox.getManager().doPost('/user-groups', null, params);
    }

    doDelete(groupName) {
        return this.toolbox.getManager().doDelete(`/user-groups/${groupName}`);
    }

    doSetRole(groupName, role) {
        return this.toolbox.getManager().doPost(`/user-groups/${groupName}`, null, {role});
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

    doAddTenantToGroup(tenant_name, group_name, role) {
        return this.toolbox.getManager().doPut('/tenants/user-groups', null, {tenant_name, group_name, role});
    }

    doRemoveTenantFromGroup(tenant_name, group_name) {
        return this.toolbox.getManager().doDelete('/tenants/user-groups', null, {tenant_name, group_name});
    }

    doUpdateTenant(tenant_name, group_name, role) {
        return this.toolbox.getManager().doPatch('/tenants/user-groups', null, {tenant_name, group_name, role});
    }

    doHandleUsers(groupName, usersToAdd, usersToDelete) {
        let addActions = _.map(usersToAdd,(username)=> this.doAddUserToGroup(username, groupName));
        let deleteActions = _.map(usersToDelete,(username)=> this.doRemoveUserFromGroup(username, groupName));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doHandleTenants(groupName, tenantsToAdd, tenantsToDelete, tenantsToUpdate) {
        let addActions = _.map(tenantsToAdd,(role, tenant)=> this.doAddTenantToGroup(tenant, groupName, role));
        let deleteActions = _.map(tenantsToDelete,(tenant)=> this.doRemoveTenantFromGroup(tenant, groupName));
        let updateActions = _.map(tenantsToUpdate,(role, tenant)=> this.doUpdateTenant(tenant, groupName, role));

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    isCurrentUserIn(users) {
        return _.includes(users, this.toolbox.getManager().getCurrentUsername());
    }

    isUserNotAdmin(username = this.toolbox.getManager().getCurrentUsername()) {
        return username !== Stage.Common.Consts.adminUsername;
    }

    isAdminGroup(group) {
        return group.role === Stage.Common.Consts.sysAdminRole;
    }

    // Check if user <username> belongs to group <group> and it is the only admin group he belongs to
    isUserGroupTheOnlyAdminGroup(group, groups, username = this.toolbox.getManager().getCurrentUsername()) {
        if (_.includes(group.users, username)) {
            let currentUserAdminGroups = _.filter(groups, g =>
                _.includes(g.users, username) && (g.role === Stage.Common.Consts.sysAdminRole));
            return _.size(currentUserAdminGroups) === 1;
        } else {
            return false;
        }
    }
}