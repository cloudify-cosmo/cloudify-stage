import type { PaginatedResponse } from 'backend/types';
import type { Deployment } from 'app/widgets/common/deploymentsView/types';
import type { FetchDataFunction } from 'cloudify-ui-components';
import type { Execution, ExecutionAction } from 'app/utils/shared/ExecutionUtils';
import type { Toolbox, Widget } from 'app/utils/StageAPI';
import type { DeploymentsConfiguration } from 'widgets/deployments/src/widget';
import type { Visibility } from 'app/widgets/common/types';

export const FetchedDataFieldsOfExecution = [
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

export type EnhancedDeployment = Pick<Deployment, typeof FetchedDataFieldsOfExecution[number]> & {
    nodeInstancesCount: number;
    nodeInstancesStates: Record<string, number | null | undefined>;

    isUpdated: boolean;
    lastExecution: Execution;
};

export interface DeploymentViewData<ItemsData = EnhancedDeployment> extends PaginatedResponse<ItemsData> {
    blueprintId: string;
    total: number;
    searchValue?: string;
}

export type DeploymentViewDataWithSelected = DeploymentViewData<EnhancedDeployment & { isSelected: boolean }>;

export interface DeploymentViewProps {
    data: DeploymentViewDataWithSelected;
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
