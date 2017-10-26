/**
 * Created by kinneretzin on 10/11/2016.
 */

import StageUtils from './stageUtils';
import External from './External';
import Internal from './Internal';
import Cookies from 'js-cookie';
import _ from 'lodash';

export default class Auth {

    static login(username,password) {
        var external = new External({basicAuth: btoa(`${username}:${password}`)});
        return external.doPost(StageUtils.url('/auth/login'), null, null, true, null, true);
    }

    static getUserData(managerData){
        var internal = new Internal(managerData);
        return internal.doGet('/auth/user', null, true);
    }

    static logout(managerData) {
        var internal = new Internal(managerData);
        return internal.doPost('/auth/logout', null, null, true, null, true);
    }

    static isLoggedIn(){
        return !!Cookies.get('XSRF-TOKEN');
    }

    static getRBACConfig(managerData){
        var internal = new Internal(managerData);
        return internal.doGet('/auth/RBAC', null, true);
    }

    static isUserAuthorized(permission, managerData) {
        var authorizedRoles = managerData.permissions[permission];

        var systemRole = managerData.auth.role;
        var currentTenantRoles = managerData.auth.tenantsRoles[managerData.tenants.selected];
        var tenantRoles = currentTenantRoles ? currentTenantRoles.roles : [];
        var userRoles = tenantRoles.concat(systemRole);
        return _.intersection(authorizedRoles, userRoles).length > 0;
    }
}
