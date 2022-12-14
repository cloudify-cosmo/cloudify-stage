import type { Constraint } from '../types';

export default function getConstraintValueFunction(constraints: Constraint[]) {
    return (constraintName: string) => {
        if (_.isEmpty(constraints)) {
            return undefined;
        }
        const index = _.findIndex(constraints, constraintName);
        return index >= 0 ? constraints[index][constraintName] : null;
    };
}
