import type { Toolbox } from 'app/utils/StageAPI';
import type { PaginatedResponse } from 'backend/types';

export default class {
    constructor(private toolbox: Toolbox) {}

    doDelete(tenantName: string) {
        return this.toolbox.getManager().doDelete(`/tenants/${tenantName}`);
    }

    doCreate(tenantName: string) {
        return this.toolbox.getManager().doPost(`/tenants/${tenantName}`);
    }

    doAddUser(tenantName: string, username: string, role: string) {
        return this.toolbox.getManager().doPut('/tenants/users', {
            body: {
                username,
                tenant_name: tenantName,
                role
            }
        });
    }

    doRemoveUser(tenantName: string, username: string) {
        return this.toolbox.getManager().doDelete('/tenants/users', {
            body: {
                username,
                tenant_name: tenantName
            }
        });
    }

    doUpdateUser(tenantName: string, username: string, role: string) {
        return this.toolbox.getManager().doPatch('/tenants/users', {
            body: {
                username,
                tenant_name: tenantName,
                role
            }
        });
    }

    doHandleUsers(
        tenantName: string,
        usersToAdd: Record<string, string>,
        usersToDelete: string[],
        usersToUpdate: Record<string, string>
    ) {
        const addActions = _.map(usersToAdd, (role, username) => this.doAddUser(tenantName, username, role));
        const deleteActions = _.map(usersToDelete, username => this.doRemoveUser(tenantName, username));
        const updateActions = _.map(usersToUpdate, (role, username) => this.doUpdateUser(tenantName, username, role));

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doAddUserGroup(tenantName: string, userGroup: string, role: string) {
        return this.toolbox.getManager().doPut('/tenants/user-groups', {
            body: {
                group_name: userGroup,
                tenant_name: tenantName,
                role
            }
        });
    }

    doRemoveUserGroup(tenantName: string, userGroup: string) {
        return this.toolbox.getManager().doDelete('/tenants/user-groups', {
            body: {
                group_name: userGroup,
                tenant_name: tenantName
            }
        });
    }

    doUpdateUserGroup(tenantName: string, userGroup: string, role: string) {
        return this.toolbox.getManager().doPatch('/tenants/user-groups', {
            body: {
                group_name: userGroup,
                tenant_name: tenantName,
                role
            }
        });
    }

    doHandleUserGroups(
        tenantName: string,
        groupsToAdd: Record<string, string>,
        groupsToDelete: string[],
        groupsToUpdate: Record<string, string>
    ) {
        const addActions = _.map(groupsToAdd, (role, userGroup) => this.doAddUserGroup(tenantName, userGroup, role));
        const deleteActions = _.map(groupsToDelete, userGroup => this.doRemoveUserGroup(tenantName, userGroup));
        const updateActions = _.map(groupsToUpdate, (role, userGroup) =>
            this.doUpdateUserGroup(tenantName, userGroup, role)
        );

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doGetUserGroups() {
        return this.toolbox.getManager().doGet<PaginatedResponse<{ name: string }>>('/user-groups?_include=name');
    }

    doGetUsers() {
        return this.toolbox.getManager().doGet<PaginatedResponse<{ username: string }>>('/users?_include=username');
    }
}
