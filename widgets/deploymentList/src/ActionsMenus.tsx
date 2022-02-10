// @ts-nocheck File not migrated fully to TS
export default function ActionsMenus({ deployment, onDeploymentAction, onWorkflowAction, toolbox, workflows }) {
    const { DeploymentActionsMenu, WorkflowsMenu } = Stage.Common;

    return (
        <>
            <WorkflowsMenu workflows={workflows} onClick={workflow => onWorkflowAction(deployment, workflow.name)} />
            <DeploymentActionsMenu
                onActionClick={actionName => onDeploymentAction(deployment, actionName)}
                toolbox={toolbox}
            />
        </>
    );
}

ActionsMenus.propTypes = {
    deployment: PropTypes.shape(),
    onDeploymentAction: PropTypes.func.isRequired,
    onWorkflowAction: PropTypes.func.isRequired,
    workflows: Stage.PropTypes.Workflows.isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
