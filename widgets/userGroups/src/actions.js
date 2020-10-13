/**
 * Created by jakubniezgoda on 03/02/2017.
 */

function isAdminGroup(group) {
    return group.role === Stage.Common.Consts.sysAdminRole;
}

export default class Actions {
    constructor(toolbox) {
        this.toolbox = toolbox;
        this.currentUsername = toolbox.getManager().getCurrentUsername();
        this.currentUserRole = toolbox.getManager().getCurrentUserRole();
    }

    doCreate(groupName, ldapGroup, role) {
        const params =
            _.isUndefined(ldapGroup) || _.isEmpty(ldapGroup)
                ? { group_name: groupName, role }
                : { group_name: groupName, ldap_group_dn: ldapGroup, role };

        return this.toolbox.getManager().doPost('/user-groups', null, params);
    }

    doDelete(groupName) {
        return this.toolbox.getManager().doDelete(`/user-groups/${groupName}`);
    }

    doSetRole(groupName, role) {
        return this.toolbox.getManager().doPost(`/user-groups/${groupName}`, null, { role });
    }

    doGetUsers() {
        return this.toolbox.getManager().doGet('/users?_include=username');
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
    }

    doAddUserToGroup(username, groupName) {
        return this.toolbox.getManager().doPut('/user-groups/users', null, { username, group_name: groupName });
    }

    doRemoveUserFromGroup(username, groupName) {
        return this.toolbox.getManager().doDelete('/user-groups/users', null, { username, group_name: groupName });
    }

    doAddTenantToGroup(tenantName, groupName, role) {
        return this.toolbox
            .getManager()
            .doPut('/tenants/user-groups', null, { tenant_name: tenantName, group_name: groupName, role });
    }

    doRemoveTenantFromGroup(tenantName, groupName) {
        return this.toolbox
            .getManager()
            .doDelete('/tenants/user-groups', null, { tenant_name: tenantName, group_name: groupName });
    }

    doUpdateTenant(tenantName, groupName, role) {
        return this.toolbox
            .getManager()
            .doPatch('/tenants/user-groups', null, { tenant_name: tenantName, group_name: groupName, role });
    }

    doHandleUsers(groupName, usersToAdd, usersToDelete) {
        const addActions = _.map(usersToAdd, username => this.doAddUserToGroup(username, groupName));
        const deleteActions = _.map(usersToDelete, username => this.doRemoveUserFromGroup(username, groupName));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doHandleTenants(groupName, tenantsToAdd, tenantsToDelete, tenantsToUpdate) {
        const addActions = _.map(tenantsToAdd, (role, tenant) => this.doAddTenantToGroup(tenant, groupName, role));
        const deleteActions = _.map(tenantsToDelete, tenant => this.doRemoveTenantFromGroup(tenant, groupName));
        const updateActions = _.map(tenantsToUpdate, (role, tenant) => this.doUpdateTenant(tenant, groupName, role));

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    isUserIn(users, username = this.currentUsername) {
        return _.includes(users, username);
    }

    hasCurrentUserAdminRole() {
        return this.currentUserRole === Stage.Common.Consts.sysAdminRole;
    }

    // Check if user <username> belongs to group <group> and it is the only admin group he belongs to
    isUserGroupTheOnlyAdminGroup(group, groups, username = this.currentUsername) {
        if (_.includes(group.users, username)) {
            const currentUserAdminGroups = _.filter(
                groups,
                g => _.includes(g.users, username) && g.role === Stage.Common.Consts.sysAdminRole
            );
            return _.size(currentUserAdminGroups) === 1;
        }
        return false;
    }

    // Check if user <username> is in <users>
    //          user <username> does not have admin role
    //          group <group> has admin rights
    //          user <username> belongs to group <group> as the only admin group
    isLogoutToBePerformed(group, groups, users, username = this.currentUsername) {
        return (
            this.isUserIn(users, username) &&
            !this.hasCurrentUserAdminRole() &&
            isAdminGroup(group) &&
            this.isUserGroupTheOnlyAdminGroup(group, groups, username)
        );
    }
}
