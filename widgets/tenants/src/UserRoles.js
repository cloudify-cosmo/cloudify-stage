/**
 * Created by edenp on 07/01/2018.
 */

export default class UserRoles extends React.Component {
    static propTypes = {
        tenant: PropTypes.object.isRequired,
        user: PropTypes.string.isRequired
    };

    groupGroupsByRole(groups) {
        const roles = {};

        _.forEach(groups, (group, name) => {
            const { user } = this.props;
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

    render() {
        const { tenant, user } = this.props;
        const { RolesPresenter } = Stage.Common;

        const directRole = tenant.user_roles.direct[user];
        const groupRoles = this.groupGroupsByRole(tenant.user_roles.groups);

        return <RolesPresenter directRole={directRole} groupRoles={groupRoles} />;
    }
}
