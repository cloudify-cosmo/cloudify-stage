import type { Visibility } from '../types';

export interface Deployment {
    /* eslint-disable camelcase */
    id: string;
    display_name?: string;
    description: string;
    visibility: Visibility;
    blueprint_id: string;
    site_name: string;
    created_at: string;
    updated_at: string;
    created_by: string;
    isUpdated: boolean;
    /* eslint-enable camelcase */
}
