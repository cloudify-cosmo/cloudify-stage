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
            if (_.includes(group.users, this.props.user)) {
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
        const { RolesPresenter } = Stage.Common;

        const directRole = this.props.tenant.user_roles.direct[this.props.user];
        const groupRoles = this.groupGroupsByRole(this.props.tenant.user_roles.groups);

        return <RolesPresenter directRole={directRole} groupRoles={groupRoles} />;
    }
}
