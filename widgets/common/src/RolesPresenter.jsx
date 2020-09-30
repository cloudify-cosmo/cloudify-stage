/**
 * Created by edenp on 22/10/2017.
 */

export default class RolesPresenter extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { directRole, groupRoles } = this.props;
        let restOfGroupRoles = '';
        _.forEach(_.omit(groupRoles, directRole), (groups, role) => {
            restOfGroupRoles += `${role} (${groups.join(', ')}), `;
        });
        restOfGroupRoles = restOfGroupRoles.slice(0, -2);

        return _.isEmpty(groupRoles) ? (
            // Use case 1: user
            directRole && <span>{directRole}</span>
        ) : _.has(groupRoles, directRole) ? (
            _.isEmpty(restOfGroupRoles) ? (
                // Use case 2: user (gp1)
                <span>
                    {directRole} ({groupRoles[directRole].join(', ')})
                </span>
            ) : (
                // Use case 3: user (gp1), viewer (gp2)
                <span>
                    {directRole} ({groupRoles[directRole].join(', ')}), {restOfGroupRoles}
                </span>
            )
        ) : directRole ? (
            // Use case 4: user, viewer (gp2)
            <span>
                {directRole}, {restOfGroupRoles}
            </span>
        ) : (
            // Use case 5: viewer (gp2)
            <span>{restOfGroupRoles}</span>
        );
    }
}

RolesPresenter.propTypes = {
    groupRoles: PropTypes.shape({}),
    directRole: PropTypes.string
};

RolesPresenter.defaultProps = {
    groupRoles: {},
    directRole: null
};

Stage.defineCommon({
    name: 'RolesPresenter',
    common: RolesPresenter
});
