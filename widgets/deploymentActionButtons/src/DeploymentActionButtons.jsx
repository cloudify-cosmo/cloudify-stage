export default function DeploymentActionButtons({ deployment, toolbox }) {
    const {
        Basic: { Button },
        Common: { DeploymentActionsMenu, DeploymentActionsModals, ExecuteDeploymentModal, WorkflowsMenu },
        Hooks: { useResettableState }
    } = Stage;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState(null);
    const [workflow, setWorkflow, resetWorkflow] = useResettableState(null);

    const { id, workflows } = deployment;

    return (
        <div>
            <WorkflowsMenu
                workflows={workflows}
                dropdownDirection="right"
                trigger={
                    <Button
                        className="executeWorkflowButton labeled icon"
                        color="teal"
                        icon="cogs"
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
                        className="deploymentActionsButton labeled icon"
                        color="teal"
                        icon="content"
                        disabled={!id}
                        content="Deployment actions"
                    />
                }
            />

            {id && workflow && (
                <ExecuteDeploymentModal
                    open
                    deploymentId={id}
                    workflow={workflow}
                    onHide={resetWorkflow}
                    toolbox={toolbox}
                />
            )}

            {id && activeAction && (
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
