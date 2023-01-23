import type { Label } from '../labels/types';

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

export interface Deployment {
    id: string;
    // NOTE: the property names come from the backend
    /* eslint-disable camelcase */
    display_name: string;
    site_name: string;
    blueprint_id: string;
    latest_execution_status: LatestExecutionStatus;
    deployment_status: DeploymentStatus;
    environment_type: string;
    latest_execution_total_operations: number;
    latest_execution_finished_operations: number;
    sub_services_count: number;
    /** Can be null when there are no subservices */
    sub_services_status: DeploymentStatus | null;
    sub_environments_count: number;
    /** Can be null when there are no subenvironments */
    sub_environments_status: DeploymentStatus | null;
    labels?: Label[];
    inputs: { [key: string]: unknown };
    /* eslint-enable camelcase */
}

export type DeploymentsResponse = Stage.Types.PaginatedResponse<Deployment>;
