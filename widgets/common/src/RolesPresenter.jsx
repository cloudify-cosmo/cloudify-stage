/**
 * Created by edenp on 22/10/2017.
 */

export default function RolesPresenter({ directRole, groupRoles }) {
    let restOfGroupRoles = '';
    _.forEach(_.omit(groupRoles, directRole), (groups, role) => {
        restOfGroupRoles += `${role} (${groups.join(', ')}), `;
    });
    restOfGroupRoles = restOfGroupRoles.slice(0, -2);

    if (_.isEmpty(groupRoles)) {
        // Use case 1: user
        return directRole && <span>{directRole}</span>;
    }
    if (_.has(groupRoles, directRole)) {
        if (_.isEmpty(restOfGroupRoles)) {
            // Use case 2: user (gp1)
            return (
                <span>
                    {directRole} ({groupRoles[directRole].join(', ')})
                </span>
            );
        }
        // Use case 3: user (gp1), viewer (gp2)
        return (
            <span>
                {directRole} ({groupRoles[directRole].join(', ')}), {restOfGroupRoles}
            </span>
        );
    }
    if (directRole) {
        // Use case 4: user, viewer (gp2)
        return (
            <span>
                {directRole}, {restOfGroupRoles}
            </span>
        );
    }
    // Use case 5: viewer (gp2)
    return <span>{restOfGroupRoles}</span>;
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
