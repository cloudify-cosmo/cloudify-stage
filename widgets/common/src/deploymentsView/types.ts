import type { DeploymentsViewColumnId } from './table';

export enum LatestExecutionStatus {
    Completed = 'completed',
    Failed = 'failed',
    InProgress = 'in_progress',
    Cancelled = 'cancelled'
}

export enum InstallationStatus {
    Active = 'active',
    Inactive = 'inactive'
}

export enum DeploymentStatus {
    Good = 'good',
    InProgress = 'in_progress',
    RequiresAttention = 'requires_attention'
}

export enum SubdeploymentStatus {
    Good = 'good',
    InProgress = 'in_progress',
    Failed = 'failed',
    Pending = 'pending'
}

export interface Deployment {
    id: string;
    // NOTE: the property names come from the backend
    /* eslint-disable camelcase */
    site_name: string;
    blueprint_id: string;
    latest_execution_status: LatestExecutionStatus;
    deployment_status: DeploymentStatus;
    installation_status: InstallationStatus;
    environment_type: string;
    latest_execution_total_operations: number;
    latest_execution_finished_operations: number;
    sub_services_count: number;
    sub_services_status: SubdeploymentStatus | null;
    sub_environments_count: number;
    sub_environments_status: SubdeploymentStatus | null;
    /* eslint-enable camelcase */
}

export type DeploymentsResponse = Stage.Types.PaginatedResponse<Deployment>;

export interface SharedDeploymentsViewWidgetConfiguration {
    /** In milliseconds */
    customPollingTime: number;
    fieldsToShow: DeploymentsViewColumnId[];
    pageSize: number;
    sortColumn: string;
    sortAscending: boolean;
}
