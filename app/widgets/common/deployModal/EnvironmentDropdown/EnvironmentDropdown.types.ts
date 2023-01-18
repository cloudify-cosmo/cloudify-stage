import type { Deployment } from '../../deploymentsView/types';

export interface Environment {
    id: string;
    // eslint-disable-next-line
    display_name: string;
    capabilities: Deployment['capabilities'];
}
