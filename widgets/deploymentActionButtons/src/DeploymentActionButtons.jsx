export default function DeploymentActionButtons({ deployment, toolbox }) {
    const {
        Basic: { Button },
        Common: { DeploymentActionsMenu, DeploymentActionsModals, ExecuteDeploymentModal, WorkflowsMenu },
        Hooks: { useResettableState }
    } = Stage;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState('');
    const [workflow, setWorkflow, resetWorkflow] = useResettableState({});

    const { id, workflows } = deployment;

    return (
        <div>
            <WorkflowsMenu
                workflows={workflows}
                dropdownDirection="right"
                trigger={
                    <Button
                        className="labeled icon"
                        color="teal"
                        icon="cogs"
                        id="executeWorkflowButton"
                        disabled={!id}
                        content="Execute workflow"
                    />
                }
                onClick={setWorkflow}
            />

            <DeploymentActionsMenu
                deploymentId={id}
                onActionClick={setActiveAction}
                toolbox={toolbox}
                trigger={
                    <Button
                        className="labeled icon"
                        color="teal"
                        icon="content"
                        disabled={!id}
                        content="Deployment Action"
                    />
                }
            />

            {id && (
                <ExecuteDeploymentModal
                    open={!_.isEmpty(workflow)}
                    deploymentId={id}
                    workflow={workflow}
                    onHide={resetWorkflow}
                    toolbox={toolbox}
                />
            )}

            {id && (
                <DeploymentActionsModals
                    activeAction={activeAction}
                    deploymentId={id}
                    onHide={resetActiveAction}
                    toolbox={toolbox}
                />
            )}
        </div>
    );
}

DeploymentActionButtons.propTypes = {
    deployment: PropTypes.shape({ id: PropTypes.string, workflows: PropTypes.arrayOf(PropTypes.shape({})) }).isRequired,
    toolbox: Stage.PropTypes.Toolbox.isRequired
};
