import React from 'react';

export default function RolesPresenter({
    directRole = '',
    groupRoles = {}
}: {
    directRole?: string;
    groupRoles?: Record<string, string[]>;
}) {
    let restOfGroupRoles = '';
    _.forEach(_.omit(groupRoles, directRole) as Record<string, string[]>, (groups, role) => {
        restOfGroupRoles += `${role} (${groups.join(', ')}), `;
    });
    restOfGroupRoles = restOfGroupRoles.slice(0, -2);

    if (_.isEmpty(groupRoles)) {
        // Use case 1: user
        if (!directRole) return null;
        return <span>{directRole}</span>;
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
