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
    // TODO(RD-1839): make properties required after they are stable in the backend
    environment_type?: string;
    total_operations?: number;
    finished_operations?: number;
    sub_services_count?: number;
    sub_services_status?: SubdeploymentStatus;
    sub_environments_count?: number;
    sub_environments_status?: SubdeploymentStatus;
    /* eslint-enable camelcase */
}
