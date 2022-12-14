import type { QueryObserverLoadingResult, QueryObserverSuccessResult } from 'react-query';
import { useQuery } from 'react-query';
import type { Deployment, DeploymentStatus } from '../../types';

// NOTE: use a constrained identity function to make sure the array members match the properties
// of the `DrilldownButtonDeployment` type
const subdeploymentInfoDeploymentKeys = (<T extends (keyof Deployment)[]>(keys: T) => keys)([
    'id',
    'sub_environments_count',
    'sub_environments_status',
    'sub_services_count',
    'sub_services_status'
]);

type SubdeploymentInfo = Pick<Deployment, typeof subdeploymentInfoDeploymentKeys[number]>;

const getDeploymentUrl = (id: string) => `/deployments/${id}`;

export const useSubdeploymentInfo = (deploymentId: string, toolbox: Stage.Types.Toolbox, refetchInterval: number) =>
    useQuery(
        getDeploymentUrl(deploymentId),
        ({ queryKey: url }): Promise<SubdeploymentInfo> =>
            toolbox.getManager().doGet(url, {
                params: {
                    all_sub_deployments: false,
                    _include: _.join(subdeploymentInfoDeploymentKeys)
                }
            }),
        { refetchInterval }
    );

export interface LoadingSubdeploymentsResult {
    loading: true;
}

export interface LoadedSubdeploymentsResult {
    loading: false;
    count: number;
    status: DeploymentStatus | null;
}

export type SubdeploymentsResult = LoadingSubdeploymentsResult | LoadedSubdeploymentsResult;

export const getSubdeploymentResults = (
    subdeploymentInfoResult:
        | QueryObserverLoadingResult<SubdeploymentInfo>
        | QueryObserverSuccessResult<SubdeploymentInfo>
): { subservices: SubdeploymentsResult; subenvironments: SubdeploymentsResult } => {
    if (subdeploymentInfoResult.isLoading) {
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
    } = subdeploymentInfoResult.data;

    return {
        subservices: { loading: false, count: sub_services_count, status: sub_services_status },
        subenvironments: { loading: false, count: sub_environments_count, status: sub_environments_status }
    };
};
