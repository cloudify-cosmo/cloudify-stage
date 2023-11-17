import type { FullDeploymentData } from 'app/widgets/common/deployments/DeploymentActions';
import type { fetchedDeploymentFields } from './widget.consts';

export type FetchedDeployment = Pick<FullDeploymentData, typeof fetchedDeploymentFields[number]>;

export type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    { status: 'success'; data: FetchedDeployment } | { status: 'loading' } | { status: 'error'; error: Error };
