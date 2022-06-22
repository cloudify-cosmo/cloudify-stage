import type { Role } from '../roles/RolesPicker';

export type NewTenants = Record<string, Role>;

export function tenantChange(field: { value?: any }, tenants: any, toolbox: Stage.Types.Toolbox) {
    const newTenants: NewTenants = _(field.value)
        .keyBy()
        .mapValues(
            tenant => tenants[tenant] || Stage.Common.Roles.Utils.getDefaultRoleName(toolbox.getManagerState().roles)
        )
        .value();
    return newTenants;
}
