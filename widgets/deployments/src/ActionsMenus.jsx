export default function ActionsMenus({ deploymentId, onDeploymentAction, onWorkflowAction, toolbox, workflows }) {
    const { DeploymentActionsMenu, WorkflowsMenu } = Stage.Common;

    return (
        <>
            <WorkflowsMenu
                workflows={workflows}
                popupMenuProps={{ icon: 'cogs' }}
                onClick={workflow => onWorkflowAction(deploymentId, workflow.name)}
            />
            <DeploymentActionsMenu
                onActionClick={actionName => onDeploymentAction(deploymentId, actionName)}
                toolbox={toolbox}
            />
        </>
    );
}

ActionsMenus.propTypes = {
    deploymentId: PropTypes.string.isRequired,
    onDeploymentAction: PropTypes.func.isRequired,
    onWorkflowAction: PropTypes.func.isRequired,
    workflows: Stage.PropTypes.Workflows.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
