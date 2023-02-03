import type { PaginatedResponse } from 'backend/types';
import type { Deployment } from 'app/widgets/common/deploymentsView/types';
import type { FetchDataFunction } from 'cloudify-ui-components';
import type { Execution, ExecutionAction } from 'app/utils/shared/ExecutionUtils';
import type { Toolbox, Widget } from 'app/utils/StageAPI';
import type { DeploymentsConfiguration } from 'widgets/deployments/src/widget';
import type { Workflow } from 'app/widgets/common/executeWorkflow';
import type { Visibility } from 'app/widgets/common/types';

export interface EnhancedDeployment extends Deployment {
    nodeInstancesCount: number;
    nodeInstancesStates: Record<string, number | null | undefined>;
    // eslint-disable-next-line camelcase
    created_at: string; // date string
    // eslint-disable-next-line camelcase
    updated_at: string; // date string,

    // eslint-disable-next-line camelcase
    created_by: string;

    isUpdated: boolean;
    lastExecution: Execution;
    visibility: Visibility;

    workflows: Workflow[]; // TODO CR: not sure of that one, but deployment segement assumes it
}

export default {
    data: PropTypes.shape({
        blueprintId: PropTypes.string,
        items: PropTypes.arrayOf(
            PropTypes.shape({
                blueprint_id: PropTypes.string,
                created_at: PropTypes.string,
                id: PropTypes.string,
                isSelected: PropTypes.bool,
                lastExecution: PropTypes.shape({}),
                nodeInstancesCount: PropTypes.number,
                nodeInstancesStates: PropTypes.objectOf(PropTypes.number),
                site_name: PropTypes.string,
                updated_at: PropTypes.string,
                visibility: PropTypes.string
            })
        ),
        total: PropTypes.number
    }).isRequired,
    widget: Stage.PropTypes.Widget.isRequired,
    fetchData: PropTypes.func.isRequired,
    onSelectDeployment: PropTypes.func.isRequired,
    onActOnExecution: PropTypes.func.isRequired,
    onDeploymentAction: PropTypes.func.isRequired,
    onWorkflowAction: PropTypes.func.isRequired,
    onSetVisibility: PropTypes.func.isRequired,
    allowedSettingTo: PropTypes.arrayOf(PropTypes.string),
    noDataMessage: PropTypes.string.isRequired,
    showExecutionStatusLabel: PropTypes.bool.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};

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

    onSetVisibility: (id: string, visibility: string) => void;
    allowedSettingTo: Visibility[];
    noDataMessage: string;
    showExecutionStatusLabel: boolean;
    toolbox: Toolbox;
}
