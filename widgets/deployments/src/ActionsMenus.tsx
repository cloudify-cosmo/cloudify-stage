import type { WorkflowsMenuProps } from '../../../app/widgets/common/executeWorkflow/WorkflowsMenu';

const WorkflowsMenu = Stage.Common.Workflows.Menu;

interface ActionsMenusProps<D> {
    deployment?: D;
    onDeploymentAction: (deployment: D | undefined, actionName: string) => void;
    onWorkflowAction: (deployment: D | undefined, workflowName: string) => void;
    workflows: WorkflowsMenuProps['workflows'];
    toolbox: Stage.Types.Toolbox;
}

export default function ActionsMenus<D>({
    deployment,
    onDeploymentAction,
    onWorkflowAction,
    toolbox,
    workflows
}: ActionsMenusProps<D>) {
    const DeploymentActionsMenu = Stage.Common.Deployments.ActionsMenu;

    return (
        <>
            <WorkflowsMenu workflows={workflows} onClick={workflow => onWorkflowAction(deployment, workflow.name)} />
            <DeploymentActionsMenu
                onActionClick={actionName => onDeploymentAction(deployment, actionName)}
                toolbox={toolbox}
                workflows={workflows}
            />
        </>
    );
}
