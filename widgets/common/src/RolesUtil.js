/**
 * Created by edenp on 25/10/2017.
 */

class RolesUtil {
    static getTenantRoles(roles) {
        return _.filter(roles, {type: 'tenant_role'});
    }
    static getDefaultRoleName(roles) {
        return _.reverse(this.getTenantRoles(roles))[0].name
    }
    static getSystemRole(isAdmin) {
        return isAdmin
            ? Stage.Common.Consts.sysAdminRole
            : Stage.Common.Consts.defaultUserRole;
    }
}

Stage.defineCommon({
    name: 'RolesUtil',
    common: RolesUtil
});