interface Role {
    name: string;
    type: string;
}

export function getTenantRoles(roles: Role[]) {
    return _.filter(roles, { type: 'tenant_role' });
}

export function getDefaultRoleName(roles: Role[]) {
    return _.reverse(getTenantRoles(roles))[0].name;
}

export function getSystemRole(isAdmin: boolean) {
    return isAdmin ? Stage.Common.Consts.sysAdminRole : Stage.Common.Consts.defaultUserRole;
}
