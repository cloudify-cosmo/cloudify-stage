import type { FunctionComponent } from 'react';

interface DeploymentActionButtonsProps {
    deployment: { id: string; workflows: unknown[] };
    toolbox: Stage.Types.Toolbox;
}

const DeploymentActionButtons: FunctionComponent<DeploymentActionButtonsProps> = ({ deployment, toolbox }) => {
    const {
        Basic: { Button },
        // @ts-expect-error Those commons are not migrated to TS yet
        Common: { DeploymentActionsMenu, DeploymentActionsModals, ExecuteDeploymentModal, WorkflowsMenu },
        Hooks: { useResettableState }
    } = Stage;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState<string | null>(null);
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
};
export default DeploymentActionButtons;
