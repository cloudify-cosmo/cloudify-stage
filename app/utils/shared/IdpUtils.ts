import _ from 'lodash';
import type { ManagerData } from '../../reducers/managerReducer';

export default class IdpUtils {
    static isLocal(managerData: ManagerData) {
        return managerData.auth.identityProviders === 'local';
    }

    static isLdap(managerData: ManagerData) {
        return managerData.auth.identityProviders.includes('ldap');
    }

    static isOkta(managerData: ManagerData) {
        return managerData.auth.identityProviders.includes('okta');
    }
}
