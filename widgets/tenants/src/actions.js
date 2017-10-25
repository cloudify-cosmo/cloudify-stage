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

    doAddUser(tenantName, username, role) {
        return this.toolbox.getManager().doPut('/tenants/users', null, {
            'username': username,
            'tenant_name': tenantName,
            role
        });
    }

    doRemoveUser(tenantName, username) {
        return this.toolbox.getManager().doDelete('/tenants/users', null, {
            'username': username,
            'tenant_name': tenantName
        });
    }

    doUpdateUser(tenantName, username, role) {
        return this.toolbox.getManager().doPatch('/tenants/users', null, {
            'username': username,
            'tenant_name': tenantName,
            role
        });
    }

    doHandleUsers(tenantName, usersToAdd, usersToDelete, usersToUpdate) {
        let addActions = _.map(usersToAdd, (role, username) => this.doAddUser(tenantName, username, role));
        let deleteActions = _.map(usersToDelete, (username)=> this.doRemoveUser(tenantName, username));
        let updateActions = _.map(usersToUpdate, (role, username)=> this.doUpdateUser(tenantName, username, role));

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doAddUserGroup(tenantName, userGroup, role) {
        return this.toolbox.getManager().doPut('/tenants/user-groups', null, {
            'group_name': userGroup,
            'tenant_name': tenantName,
            role
        });
    }

    doRemoveUserGroup(tenantName, userGroup) {
        return this.toolbox.getManager().doDelete('/tenants/user-groups',null,{
            'group_name': userGroup,
            'tenant_name': tenantName
        });
    }

    doUpdateUserGroup(tenantName, userGroup, role) {
        return this.toolbox.getManager().doPatch('/tenants/user-groups', null, {
            'group_name': userGroup,
            'tenant_name': tenantName,
            role
        });
    }

    doHandleUserGroups(tenantName, groupsToAdd, groupsToDelete, groupsToUpdate) {
        let addActions = _.map(groupsToAdd,(role, userGroup) => this.doAddUserGroup(tenantName, userGroup, role));
        let deleteActions = _.map(groupsToDelete,(userGroup)=> this.doRemoveUserGroup(tenantName, userGroup));
        let updateActions = _.map(groupsToUpdate,(role, userGroup)=> this.doUpdateUserGroup(tenantName, userGroup, role));

        return Promise.all(_.concat(addActions, deleteActions, updateActions));
    }

    doGetUserGroups() {
        return this.toolbox.getManager().doGet('/user-groups?_include=name');
    }

    doGetUsers() {
        return this.toolbox.getManager().doGet('/users?_include=username');
    }
}