/**
 * Created by edenp on 07/01/2018.
 */

let PropTypes = React.PropTypes;

export default class UserRoles extends React.Component {

    static propTypes = {
        tenant: PropTypes.object.isRequired,
        user: PropTypes.string.isRequired
    };

    _groupGroupsByRole(groups){
        let roles = {};

        _.forEach(groups, (group, name) => {
            if(_.includes(group.users, this.props.user)){
                if(_.has(roles, group.role)){
                    roles[group.role].push(name)
                } else{
                    roles[group.role] = [name];
                }
            }
        });
        return roles;
    }

    render() {
        let RolesPresenter = Stage.Common.RolesPresenter;

        let directRole = this.props.tenant.user_roles.direct[this.props.user];
        let groupRoles = this._groupGroupsByRole(this.props.tenant.user_roles.groups);

        return (
            <RolesPresenter directRole={directRole} groupRoles={groupRoles}/>
        )
    }
}
