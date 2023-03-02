import type { FullDeploymentData } from 'app/widgets/common/deployments/DeploymentActions';

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

export const deploymentFields = [
    'id',
    'display_name',
    'site_name',
    'blueprint_id',
    'latest_execution_status',
    'deployment_status',
    'environment_type',
    'latest_execution_total_operations',
    'latest_execution_finished_operations',
    'sub_services_count',
    'sub_services_status',
    'sub_environments_count',
    'sub_environments_status',
    'labels',
    'capabilities'
] as const;

export type Deployment = Pick<FullDeploymentData, typeof deploymentFields[number]>;

export type DeploymentsResponse = Stage.Types.PaginatedResponse<Deployment>;
