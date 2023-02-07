import type { Workflow } from 'app/widgets/common/executeWorkflow';
import type { Visibility } from 'app/widgets/common/types';
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
    created_at: string; // date string
    updated_at: string; // date string,
    created_by?: string;
    visibility: Visibility;
    description: string | null;
    latest_execution: string;
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
    workflows: Workflow[];
    inputs: { [key: string]: unknown };
    capabilities: { [key: string]: unknown };
    /* eslint-enable camelcase */
}

export type DeploymentsResponse = Stage.Types.PaginatedResponse<Deployment>;
