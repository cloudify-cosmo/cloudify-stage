import type { DropdownProps } from 'semantic-ui-react';
import type { Role } from '../roles/RolesPicker';

export type RolesAssignment = Record<string, Role>;

export function mapTenantsToRoles(
    field: { value?: DropdownProps },
    tenants: Record<string, Role>,
    toolbox: Stage.Types.Toolbox
) {
    const newTenants: RolesAssignment = _(field.value)
        .keyBy()
        .mapValues(
            tenant => tenants[tenant] || Stage.Common.Roles.Utils.getDefaultRoleName(toolbox.getManagerState().roles)
        )
        .value();
    return newTenants;
}
