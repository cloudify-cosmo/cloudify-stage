/**
 * Created by jakubniezgoda on 31/01/2017.
 */

export default class {
    constructor(toolbox) {
        this.toolbox = toolbox;
    }

    doDelete(tenantName) {
        return this.toolbox.getManager().doDelete(`/tenants/${tenantName}`);
    }

    doCreate(tenantName) {
        return this.toolbox.getManager().doPost(`/tenants/${tenantName}`);
    }

    doAddUser(tenantName, username) {
        return this.toolbox.getManager().doPut('/tenants/users', null, {
            'username': username,
            'tenant_name': tenantName
        });
    }

    doRemoveUser(tenantName, username) {
        return this.toolbox.getManager().doDelete('/tenants/users', null, {
            'username': username,
            'tenant_name': tenantName
        });
    }

    doHandleUsers(tenantName, usersToAdd, usersToDelete) {
        let addActions = _.map(usersToAdd, (username) => this.doAddUser(tenantName, username));
        let deleteActions = _.map(usersToDelete, (username)=> this.doRemoveUser(tenantName, username));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doAddUserGroup(tenantName, userGroup) {
        return this.toolbox.getManager().doPut('/tenants/user-groups', null, {
            'group_name': userGroup,
            'tenant_name': tenantName
        });
    }

    doRemoveUserGroup(tenantName, userGroup) {
        return this.toolbox.getManager().doDelete('/tenants/user-groups',null,{
            'group_name': userGroup,
            'tenant_name': tenantName
        });
    }

    doHandleUserGroups(tenantName, groupsToAdd, groupsToDelete) {
        let addActions = _.map(groupsToAdd,(userGroup) => this.doAddUserGroup(tenantName, userGroup));
        let deleteActions = _.map(groupsToDelete,(userGroup)=> this.doRemoveUserGroup(tenantName, userGroup));

        return Promise.all(_.concat(addActions, deleteActions));
    }

    doGetUserGroups() {
        return this.toolbox.getManager().doGet('/user-groups?_include=name');
    }

    doGetUsers() {
        return this.toolbox.getManager().doGet('/users?_include=username');
    }
}