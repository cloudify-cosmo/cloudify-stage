import { useCallback, useContext, useMemo } from 'react';
import DeploymentIdContext from '../utils/deploymentIdContext';
import BlueprintIdContext from '../utils/blueprintIdContext';
import getConstraintValueFunction from '../utils/getConstraintValueFunction';
import type { Constraint } from '../types';

export default function useFetchUrlWithDeploymentId(
    fetchUrl: string,
    constraints: Constraint[],
    evaluateBlueprintIdConstraint?: boolean
) {
    const { appendQueryParam } = Stage.Utils.Url;
    const deploymentIdFromContext = useContext(DeploymentIdContext);
    const blueprintIdFromContext = useContext(BlueprintIdContext);

    const hasConstraint = useCallback(
        (constraintName: string) => {
            return !!getConstraintValueFunction(constraints)(constraintName);
        },
        [constraints]
    );

    return useMemo(() => {
        if (evaluateBlueprintIdConstraint && !hasConstraint('blueprint_id') && blueprintIdFromContext) {
            return appendQueryParam(fetchUrl, { blueprint_id: blueprintIdFromContext });
        }

        if (!hasConstraint('deployment_id') && deploymentIdFromContext) {
            return appendQueryParam(fetchUrl, { deployment_id: deploymentIdFromContext });
        }

        return fetchUrl;
    }, [blueprintIdFromContext, deploymentIdFromContext, fetchUrl, constraints]);
}
