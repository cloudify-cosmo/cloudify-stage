type Groups = Record<string, { users: any; role: string }>;

export default function UserRoles({
    tenant,
    user
}: {
    // eslint-disable-next-line camelcase
    tenant: { user_roles: { direct: Record<string, string>; groups: Groups } };
    user: string;
}) {
    function groupGroupsByRole(groups: Groups) {
        const roles: Record<string, string[]> = {};

        _.forEach(groups, (group, name) => {
            if (_.includes(group.users, user)) {
                if (_.has(roles, group.role)) {
                    roles[group.role].push(name);
                } else {
                    roles[group.role] = [name];
                }
            }
        });
        return roles;
    }

    const RolesPresenter = Stage.Common.Roles.Presenter;

    const directRole = tenant.user_roles.direct[user];
    const groupRoles = groupGroupsByRole(tenant.user_roles.groups);

    return <RolesPresenter directRole={directRole} groupRoles={groupRoles} />;
}
