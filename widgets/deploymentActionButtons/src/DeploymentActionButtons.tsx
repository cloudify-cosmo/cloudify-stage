import { FunctionComponent, useEffect } from 'react';

type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    | { status: 'success'; data: { display_name: string; workflows: unknown[] } }
    | { status: 'loading' }
    | { status: 'error'; error: Error };

const isDeploymentFetched = (state: FetchedDeploymentState): state is FetchedDeploymentState & { status: 'success' } =>
    state.status === 'success';

interface DeploymentActionButtonsProps {
    deploymentId?: string | null;
    fetchedDeploymentState: FetchedDeploymentState;
    toolbox: Stage.Types.Toolbox;
    redirectToParentPageAfterDelete: boolean;
}

const DeploymentActionButtons: FunctionComponent<DeploymentActionButtonsProps> = ({
    deploymentId,
    fetchedDeploymentState,
    toolbox,
    redirectToParentPageAfterDelete
}) => {
    const {
        Basic: { Button },
        // @ts-expect-error Some commons are not migrated to TS yet
        Common: { DeploymentActionsMenu, DeploymentActionsModals, ExecuteWorkflowModal, WorkflowsMenu },
        Hooks: { useResettableState }
    } = Stage;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState<string | null>(null);
    const [workflow, setWorkflow, resetWorkflow] = useResettableState('');

    useEffect(() => {
        if (fetchedDeploymentState.status === 'error') {
            log.error('Error when fetching deployment data', fetchedDeploymentState.error);
        }
    }, [fetchedDeploymentState]);

    const buttonsDisabled = !deploymentId || ['error', 'loading'].includes(fetchedDeploymentState.status);

    return (
        <div>
            <WorkflowsMenu
                workflows={isDeploymentFetched(fetchedDeploymentState) ? fetchedDeploymentState.data.workflows : []}
                dropdownDirection="right"
                trigger={
                    <Button
                        className="executeWorkflowButton labeled icon"
                        color="teal"
                        icon="cogs"
                        disabled={buttonsDisabled}
                        content="Execute workflow"
                    />
                }
                onClick={setWorkflow}
            />

            <DeploymentActionsMenu
                onActionClick={setActiveAction}
                toolbox={toolbox}
                trigger={
                    <Button
                        className="deploymentActionsButton labeled icon"
                        color="teal"
                        icon="content"
                        disabled={buttonsDisabled}
                        content="Deployment actions"
                    />
                }
            />

            {isDeploymentFetched(fetchedDeploymentState) && deploymentId && workflow && (
                <ExecuteWorkflowModal
                    open
                    deploymentId={deploymentId}
                    deploymentName={fetchedDeploymentState.data.display_name}
                    workflow={workflow}
                    onHide={resetWorkflow}
                    toolbox={toolbox}
                />
            )}

            {isDeploymentFetched(fetchedDeploymentState) && deploymentId && activeAction && (
                <DeploymentActionsModals
                    activeAction={activeAction}
                    deploymentId={deploymentId}
                    deploymentName={fetchedDeploymentState.data.display_name}
                    onHide={resetActiveAction}
                    toolbox={toolbox}
                    redirectToParentPageAfterDelete={redirectToParentPageAfterDelete}
                />
            )}
        </div>
    );
};
export default DeploymentActionButtons;
