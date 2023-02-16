import type { Visibility } from 'app/widgets/common/types';
import type { DataTableConfiguration, PollingTimeConfiguration } from 'app/utils/GenericConfig';

export interface FetchedSite {
    /* eslint-disable camelcase */
    created_at: string;
    created_by: string;
    latitude?: number;
    longitude?: number;
    location?: string;
    name: string;
    private_resource: boolean;
    resource_availability: string;
    tenant_name: string;
    visibility: Visibility;
    /* eslint-enable camelcase */
}

export interface Site extends Omit<FetchedSite, 'created_at'> {
    /* eslint-disable-next-line camelcase */
    created_at: string;
    deploymentCount: number;
}

export interface DeploymentSummary {
    /* eslint-disable-next-line camelcase */
    site_name?: string;
    deployments: number;
}

export declare namespace SitesWidget {
    export type Configuration = PollingTimeConfiguration & DataTableConfiguration;
    export interface Data {
        sites: Stage.Types.PaginatedResponse<FetchedSite>;
        siteDeploymentCount: Stage.Types.PaginatedResponse<DeploymentSummary>;
    }
}
