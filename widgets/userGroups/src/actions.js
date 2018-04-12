/**
 * Created by jakubniezgoda on 03/02/2017.
 */

export default class Actions {

    constructor(toolbox) {
        this.toolbox = toolbox;
        this.currentUsername = toolbox.getManager().getCurrentUsername();
        this.currentUserRole = toolbox.getManager().getCurrentUserRole();
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
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
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

    _isUserIn(users, username = this.currentUsername) {
        return _.includes(users, username);
    }

    _hasCurrentUserAdminRole() {
        return this.currentUserRole === Stage.Common.Consts.sysAdminRole;
    }

    _isAdminGroup(group) {
        return group.role === Stage.Common.Consts.sysAdminRole;
    }

    // Check if user <username> belongs to group <group> and it is the only admin group he belongs to
    _isUserGroupTheOnlyAdminGroup(group, groups, username = this.currentUsername) {
        if (_.includes(group.users, username)) {
            let currentUserAdminGroups = _.filter(groups, g =>
                _.includes(g.users, username) && (g.role === Stage.Common.Consts.sysAdminRole));
            return _.size(currentUserAdminGroups) === 1;
        } else {
            return false;
        }
    }

    // Check if user <username> is in <users>
    //          user <username> does not have admin role
    //          group <group> has admin rights
    //          user <username> belongs to group <group> as the only admin group
    isLogoutToBePerformed(group, groups, users, username = this.currentUsername) {
        return this._isUserIn(users, username) &&
               !this._hasCurrentUserAdminRole() &&
               this._isAdminGroup(group) &&
               this._isUserGroupTheOnlyAdminGroup(group, groups, username);
    }
}