import type { QueryObserverLoadingResult, QueryObserverSuccessResult } from 'react-query';
import type { Deployment, DeploymentStatus } from '../../types';

export type SubdeploymentsResult =
    | { loading: true }
    | { loading: false; count: number; status: DeploymentStatus | null };

export const getSubdeploymentResults = (
    deploymentDetailsResult: QueryObserverLoadingResult<Deployment> | QueryObserverSuccessResult<Deployment>
): { subservices: SubdeploymentsResult; subenvironments: SubdeploymentsResult } => {
    if (deploymentDetailsResult.isLoading) {
        return {
            subservices: { loading: true },
            subenvironments: { loading: true }
        };
    }

    const {
        /* eslint-disable camelcase */
        sub_environments_count,
        sub_environments_status,
        sub_services_count,
        sub_services_status
        /* eslint-enable camelcase */
    } = deploymentDetailsResult.data;

    return {
        subservices: { loading: false, count: sub_services_count, status: sub_services_status },
        subenvironments: { loading: false, count: sub_environments_count, status: sub_environments_status }
    };
};
