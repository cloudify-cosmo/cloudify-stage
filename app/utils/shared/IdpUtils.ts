import type { ManagerData } from '../../reducers/managerReducer';

export default class IdpUtils {
    static isLocal(managerData: ManagerData) {
        const { identityProviders } = managerData.auth;
        return identityProviders.length === 1 && identityProviders[0] === 'local';
    }

    static isLdap(managerData: ManagerData) {
        return managerData.auth.identityProviders.includes('ldap');
    }

    static isOkta(managerData: ManagerData) {
        return managerData.auth.identityProviders.includes('okta');
    }
}
