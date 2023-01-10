import { isEmpty, map } from 'lodash';
import type { Toolbox } from '../../../app/utils/StageAPI';
import type { RolesAssignment } from '../../../app/widgets/common/tenants/utils';
import type { SystemRole } from '../../../app/widgets/common/roles/types';

export interface GetAuthUserResponse {
    email: string;
    // eslint-disable-next-line camelcase
    selected_manager_address: string;
    status: string;
}

/* eslint-disable camelcase */
interface TenantRole {
    tenant_name: string;
    role_name: string;
}

export interface PostAuthUsersInviteRequestBody {
    email: string;
    role_name: SystemRole;
    tenants?: TenantRole[];
}
/* eslint-enable camelcase */

export default class AuthServiceActions {
    external: ReturnType<Toolbox['getExternal']>;

    constructor(toolbox: Toolbox) {
        this.external = toolbox.getExternal(undefined);
    }

    isAuthServiceAvailable() {
        const isReponseFromAuthService = (response: GetAuthUserResponse | string) => typeof response === 'object';

        return this.external
            .doGet<GetAuthUserResponse | string>('/auth/users/me')
            .then(isReponseFromAuthService)
            .catch(() => false);
    }

    doInvite(email: string, isAdmin: boolean, rolesAssignments: RolesAssignment) {
        const { sysAdminRole, defaultUserRole } = Stage.Common.Consts;
        const body: PostAuthUsersInviteRequestBody = { email, role_name: isAdmin ? sysAdminRole : defaultUserRole };
        const tenants: TenantRole[] = map(rolesAssignments, (roleName, tenantName) => ({
            role_name: roleName,
            tenant_name: tenantName
        }));
        if (!isEmpty(tenants)) body.tenants = tenants;

        return this.external.doPost<never, PostAuthUsersInviteRequestBody>('/auth/users/invite', {
            body
        });
    }
}
