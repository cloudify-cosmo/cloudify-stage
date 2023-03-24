import type { FullDeploymentData } from 'app/widgets/common/deployments/DeploymentActions';

export type FetchedDeployment = Pick<
    FullDeploymentData,
    'id' | 'display_name' | 'workflows' | 'labels' | 'capabilities'
>;

export type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    { status: 'success'; data: FetchedDeployment } | { status: 'loading' } | { status: 'error'; error: Error };
