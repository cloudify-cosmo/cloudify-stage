/**
 * Created by edenp on 22/10/2017.
 */

export default class RolesPresenter extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    static propTypes = {
        groupRoles: PropTypes.object,
        directRole: PropTypes.string
    };

    render() {
        let restOfGroupRoles = '';
        _.forEach(_.omit(this.props.groupRoles, this.props.directRole), (groups, role) => {
            restOfGroupRoles += `${role} (${groups.join(', ')}), `;
        });
        restOfGroupRoles = restOfGroupRoles.slice(0, -2);

        return _.isEmpty(this.props.groupRoles) ? (
            // Use case 1: user
            this.props.directRole && <span>{this.props.directRole}</span>
        ) : _.has(this.props.groupRoles, this.props.directRole) ? (
            _.isEmpty(restOfGroupRoles) ? (
                // Use case 2: user (gp1)
                <span>
                    {this.props.directRole} ({this.props.groupRoles[this.props.directRole].join(', ')})
                </span>
            ) : (
                // Use case 3: user (gp1), viewer (gp2)
                <span>
                    {this.props.directRole} ({this.props.groupRoles[this.props.directRole].join(', ')}),{' '}
                    {restOfGroupRoles}
                </span>
            )
        ) : this.props.directRole ? (
            // Use case 4: user, viewer (gp2)
            <span>
                {this.props.directRole}, {restOfGroupRoles}
            </span>
        ) : (
            // Use case 5: viewer (gp2)
            <span>{restOfGroupRoles}</span>
        );
    }
}

Stage.defineCommon({
    name: 'RolesPresenter',
    common: RolesPresenter
});
