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
}

Stage.defineCommon({
    name: 'RolesUtil',
    common: RolesUtil
});