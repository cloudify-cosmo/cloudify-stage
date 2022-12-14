import { map, concat, includes, filter, size, isUndefined, isEmpty } from 'lodash';
import type { SystemRole } from '../../../app/widgets/common/roles/types';
import type { Toolbox } from '../../../app/utils/StageAPI';
import type { RolesAssignment } from '../../../app/widgets/common/tenants/utils';
import type { UserGroup } from './widget.types';

function isAdminGroup(group: UserGroup) {
    return group.role === Stage.Common.Consts.sysAdminRole;
}

export type NamedResourceResponse = Stage.Types.PaginatedResponse<{ name: string }>;

export default class Actions {
    toolbox: Toolbox;

    currentUsername: string;

    currentUserRole: SystemRole;

    constructor(toolbox: Toolbox) {
        this.toolbox = toolbox;
        this.currentUsername = toolbox.getManager().getCurrentUsername();
        this.currentUserRole = toolbox.getManager().getCurrentUserRole();
    }

    doCreate(groupName: string, ldapGroup: string, role: SystemRole) {
        const body =
            isUndefined(ldapGroup) || isEmpty(ldapGroup)
                ? { group_name: groupName, role }
                : { group_name: groupName, ldap_group_dn: ldapGroup, role };

        return this.toolbox.getManager().doPost('/user-groups', { body });
    }

    doDelete(groupName: string) {
        return this.toolbox.getManager().doDelete(`/user-groups/${groupName}`);
    }

    doSetRole(groupName: string, role: SystemRole) {
        return this.toolbox.getManager().doPost(`/user-groups/${groupName}`, { body: { role } });
    }

    doGetUsers() {
        return this.toolbox.getManager().doGet('/users?_include=username');
    }

    doGetTenants() {
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
    }

    doAddUserToGroup(username: string, groupName: string) {
        return this.toolbox.getManager().doPut('/user-groups/users', { body: { username, group_name: groupName } });
    }

    doRemoveUserFromGroup(username: string, groupName: string) {
        return this.toolbox.getManager().doDelete('/user-groups/users', { body: { username, group_name: groupName } });
    }

    doAddTenantToGroup(tenantName: string, groupName: string, role: string) {
        return this.toolbox
            .getManager()
            .doPut('/tenants/user-groups', { body: { tenant_name: tenantName, group_name: groupName, role } });
    }

    doRemoveTenantFromGroup(tenantName: string, groupName: string) {
        return this.toolbox
            .getManager()
            .doDelete('/tenants/user-groups', { body: { tenant_name: tenantName, group_name: groupName } });
    }

    doUpdateTenant(tenantName: string, groupName: string, role: string) {
        return this.toolbox
            .getManager()
            .doPatch('/tenants/user-groups', { body: { tenant_name: tenantName, group_name: groupName, role } });
    }

    doHandleUsers(groupName: string, usersToAdd: string[], usersToDelete: string[]) {
        const addActions = map(usersToAdd, username => this.doAddUserToGroup(username, groupName));
        const deleteActions = map(usersToDelete, username => this.doRemoveUserFromGroup(username, groupName));

        return Promise.all(concat(addActions, deleteActions));
    }

    doHandleTenants(
        groupName: string,
        tenantsToAdd: RolesAssignment,
        tenantsToDelete: string[],
        tenantsToUpdate: RolesAssignment
    ) {
        const addActions = map(tenantsToAdd, (role, tenant) => this.doAddTenantToGroup(tenant, groupName, role));
        const deleteActions = map(tenantsToDelete, tenant => this.doRemoveTenantFromGroup(tenant, groupName));
        const updateActions = map(tenantsToUpdate, (role, tenant) => this.doUpdateTenant(tenant, groupName, role));

        return Promise.all(concat(addActions, deleteActions, updateActions));
    }

    isUserIn(users: string[], username = this.currentUsername) {
        return includes(users, username);
    }

    hasCurrentUserAdminRole() {
        return this.currentUserRole === Stage.Common.Consts.sysAdminRole;
    }

    // Check if user <username> belongs to group <group> and it is the only admin group he belongs to
    isUserGroupTheOnlyAdminGroup(group: UserGroup, groups: UserGroup[], username = this.currentUsername) {
        if (includes(group.users, username)) {
            const currentUserAdminGroups = filter(
                groups,
                userGroup => includes(userGroup.users, username) && userGroup.role === Stage.Common.Consts.sysAdminRole
            );
            return size(currentUserAdminGroups) === 1;
        }
        return false;
    }

    // Check if user <username> is in <users>
    //          user <username> does not have admin role
    //          group <group> has admin rights
    //          user <username> belongs to group <group> as the only admin group
    isLogoutToBePerformed(group: UserGroup, groups: UserGroup[], users: string[], username = this.currentUsername) {
        return (
            this.isUserIn(users, username) &&
            !this.hasCurrentUserAdminRole() &&
            isAdminGroup(group) &&
            this.isUserGroupTheOnlyAdminGroup(group, groups, username)
        );
    }
}
