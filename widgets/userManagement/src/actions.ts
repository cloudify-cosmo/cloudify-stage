import type { SystemRole } from '../../../app/widgets/common/roles/types';
import type { Toolbox } from '../../../app/utils/StageAPI';
import type { RolesAssignment } from '../../../app/widgets/common/tenants/utils';

export type NamedResourceResponse = Stage.Types.PaginatedResponse<{ name: string }>;

export default class Actions {
    toolbox: Toolbox;

    constructor(toolbox: Toolbox) {
        this.toolbox = toolbox;
    }

    doCreate(username: string, password: string, role: SystemRole) {
        return this.toolbox.getManager().doPut('/users', { body: { username, password, role } });
    }

    doSetPassword(username: string, password: string) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { body: { password } });
    }

    doSetRole(username: string, role: SystemRole) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { body: { role } });
    }

    doGetTenants(): Promise<NamedResourceResponse> {
        return this.toolbox.getManager().doGet('/tenants?_get_all_results=true&_include=name');
    }

    doRemoveFromTenant(username: string, tenantName: string) {
        return this.toolbox.getManager().doDelete('/tenants/users', { body: { username, tenant_name: tenantName } });
    }

    doHandleTenants(
        username: string,
        tenantsToAdd: RolesAssignment,
        tenantsToDelete: string[],
        tenantsToUpdate: RolesAssignment
    ) {
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

    doGetGroups(): Promise<NamedResourceResponse> {
        return this.toolbox.getManager().doGet('/user-groups?_include=name');
    }

    doRemoveFromGroup(username: string, groupName: string) {
        return this.toolbox.getManager().doDelete('/user-groups/users', { body: { username, group_name: groupName } });
    }

    doHandleGroups(username: string, groupsToAdd: string[], groupsToDelete: string[]) {
        const addActions = _.map(groupsToAdd, groupName =>
            this.toolbox.getManager().doPut('/user-groups/users', { body: { username, group_name: groupName } })
        );
        const deleteActions = _.map(groupsToDelete, groupName =>
            this.toolbox.getManager().doDelete('/user-groups/users', { body: { username, group_name: groupName } })
        );

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doDelete(username: string) {
        return this.toolbox.getManager().doDelete(`/users/${username}`);
    }

    doActivate(username: string) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, { body: { action: 'activate' } });
    }

    doDeactivate(username: string) {
        return this.toolbox.getManager().doPost(`/users/active/${username}`, { body: { action: 'deactivate' } });
    }

    doSetGettingStartedModalEnabled(username: string, modalEnabled: boolean) {
        return this.toolbox.getManager().doPost(`/users/${username}`, { body: { show_getting_started: modalEnabled } });
    }
}
