import type { Deployment } from '../../deploymentsView/types';

export interface FetchedDeployment {
    id: string;
    // eslint-disable-next-line
    display_name: string;
    capabilities: Deployment['capabilities'];
}
