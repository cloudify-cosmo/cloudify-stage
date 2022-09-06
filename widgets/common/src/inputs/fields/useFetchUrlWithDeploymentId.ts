import { useContext, useMemo } from 'react';
import DeploymentIdContext from '../utils/deploymentIdContext';
import getConstraintValueFunction from '../utils/getConstraintValueFunction';
import type { Constraint } from '../types';

export default function useFetchUrlWithDeploymentId(fetchUrl: string, constraints: Constraint[]) {
    return useMemo(() => {
        const deploymentIdFromConstraints: string | undefined =
            getConstraintValueFunction(constraints)('deployment_id');
        const deploymentIdFromContext = useContext(DeploymentIdContext);

        if (!deploymentIdFromConstraints && deploymentIdFromContext) {
            const { appendQueryParam } = Stage.Utils.Url;
            return appendQueryParam(fetchUrl, { deployment_id: deploymentIdFromContext });
        }

        return fetchUrl;
    }, [fetchUrl, constraints]);
}
