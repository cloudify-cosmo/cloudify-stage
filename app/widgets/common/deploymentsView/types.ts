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

export type Deployment = Omit<FullDeploymentData, 'groups'>;

export type DeploymentsResponse = Stage.Types.PaginatedResponse<Deployment>;
