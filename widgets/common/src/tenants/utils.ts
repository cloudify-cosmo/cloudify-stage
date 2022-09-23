import type { Role } from '../roles/RolesPicker';

export type RolesAssignment = Record<string, Role>;

export function mapTenantsToRoles(
    selectedTenants: string[] | undefined,
    tenants: Record<string, Role>,
    toolbox: Stage.Types.Toolbox
) {
    const newTenants: RolesAssignment = _(selectedTenants)
        .keyBy()
        .mapValues(
            tenant => tenants[tenant] || Stage.Common.Roles.Utils.getDefaultRoleName(toolbox.getManagerState().roles)
        )
        .value();
    return newTenants;
}
