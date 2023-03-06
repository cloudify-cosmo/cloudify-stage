import type { WorkflowsMenuProps } from 'app/widgets/common/executeWorkflow/WorkflowsMenu';
import type { DeploymentItem } from './types';

const WorkflowsMenu = Stage.Common.Workflows.Menu;

interface ActionsMenusProps {
    deployment: DeploymentItem;
    onDeploymentAction: (deployment: DeploymentItem | undefined, actionName: string) => void;
    onWorkflowAction: (deployment: DeploymentItem | undefined, workflowName: string) => void;
    workflows: WorkflowsMenuProps['workflows'];
    toolbox: Stage.Types.Toolbox;
}

export default function ActionsMenus({
    deployment,
    onDeploymentAction,
    onWorkflowAction,
    toolbox,
    workflows
}: ActionsMenusProps) {
    const DeploymentActionsMenu = Stage.Common.Deployments.ActionsMenu;

    return (
        <>
            <WorkflowsMenu workflows={workflows} onClick={workflow => onWorkflowAction(deployment, workflow.name)} />
            <DeploymentActionsMenu
                onActionClick={actionName => onDeploymentAction(deployment, actionName)}
                toolbox={toolbox}
                workflows={workflows}
                deploymentLabels={deployment?.labels || []}
            />
        </>
    );
}
