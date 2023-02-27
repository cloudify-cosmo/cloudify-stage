import type { PaginatedResponse } from 'backend/types';
import type { FullDeploymentData } from 'app/widgets/common/deployments/DeploymentActions';
import type { FetchDataFunction } from 'cloudify-ui-components';
import type { Execution, ExecutionAction } from 'app/utils/shared/ExecutionUtils';
import type { Toolbox, Widget } from 'app/utils/StageAPI';
import type { DeploymentsConfiguration } from 'widgets/deployments/src/widget';
import type { Visibility } from 'app/widgets/common/types';

export const FetchedDeploymentFields = [
    'id',
    'display_name',
    'blueprint_id',
    'visibility',
    'created_at',
    'created_by',
    'updated_at',
    'inputs',
    'workflows',
    'site_name',
    'latest_execution'
] as const;

export const FetchedLastExecutionFields = [
    'id',
    'deployment_id',
    'workflow_id',
    'status',
    'status_display',
    'created_at',
    'scheduled_for',
    'ended_at',
    'parameters',
    'error',
    'total_operations',
    'finished_operations'
] as const;

export type FetchedLastExecutionType = Required<Pick<Execution, typeof FetchedLastExecutionFields[number]>>;

export type EnhancedDeployment = Pick<FullDeploymentData, typeof FetchedDeploymentFields[number]> & {
    nodeInstancesCount: number;
    nodeInstancesStates: Record<string, number>;
    isUpdated: boolean;
    lastExecution: FetchedLastExecutionType;
};

export interface DeploymentsData<ItemsData = EnhancedDeployment> extends PaginatedResponse<ItemsData> {
    blueprintId: string;
    total: number;
    searchValue?: string;
}

export type DeploymentsListData = DeploymentsData<EnhancedDeployment & { isSelected: boolean }>;

export interface DeploymentViewProps {
    data: DeploymentsListData;
    widget: Widget<DeploymentsConfiguration>;
    fetchData: FetchDataFunction;
    onSelectDeployment: (deployment: EnhancedDeployment) => void;
    onActOnExecution?: (execution: Execution, action: ExecutionAction, errorMessage: any) => void;
    onDeploymentAction: (deployment: EnhancedDeployment | undefined, actionName: string) => void;
    onWorkflowAction: (deployment: EnhancedDeployment | undefined, workflowName: string) => void;
    onSetVisibility: (id: string, visibility: Visibility) => void;
    allowedSettingTo?: Visibility[];
    noDataMessage: string;
    showExecutionStatusLabel: boolean;
    toolbox: Toolbox;
}
