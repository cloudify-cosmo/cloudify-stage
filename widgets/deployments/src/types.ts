import type { PaginatedResponse } from 'backend/types';
import type { Deployment } from 'app/widgets/common/deploymentsView/types';
import type { FetchDataFunction } from 'cloudify-ui-components';
import type { Execution, ExecutionAction } from 'app/utils/shared/ExecutionUtils';
import type { Toolbox, Widget } from 'app/utils/StageAPI';
import type { DeploymentsConfiguration } from 'widgets/deployments/src/widget';
import type { Visibility } from 'app/widgets/common/types';

export interface EnhancedDeployment extends Deployment {
    nodeInstancesCount: number;
    nodeInstancesStates: Record<string, number | null | undefined>;

    isUpdated: boolean;
    lastExecution: Execution;
}

export interface DeploymentViewData extends PaginatedResponse<EnhancedDeployment> {
    blueprintId: string;
    total: number;
    searchValue?: string;
}

export type DeploymentViewDataWithSelected = DeploymentViewData &
    PaginatedResponse<EnhancedDeployment & { isSelected: boolean }>;

export interface DeploymentViewProps {
    data: DeploymentViewDataWithSelected;
    widget: Widget<DeploymentsConfiguration>;
    fetchData: FetchDataFunction;
    onSelectDeployment: (deployment: Deployment) => void;
    onActOnExecution?: (execution: Execution, action: ExecutionAction, errorMessage: any) => void;
    onDeploymentAction: (deployment: Deployment | undefined, actionName: string) => void;
    onWorkflowAction: (deployment: Deployment | undefined, workflowName: string) => void;

    onSetVisibility: (id: string, visibility: Visibility) => void;
    allowedSettingTo?: Visibility[];
    noDataMessage: string;
    showExecutionStatusLabel: boolean;
    toolbox: Toolbox;
}
