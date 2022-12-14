import type { FunctionComponent } from 'react';
import { useEffect } from 'react';
import type { Workflow } from '../../../app/widgets/common/executeWorkflow';

type FetchedDeploymentState =
    // eslint-disable-next-line camelcase
    | { status: 'success'; data: { display_name: string; workflows: Workflow[] } }
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
        Hooks: { useResettableState }
    } = Stage;
    const ExecuteWorkflowModal = Stage.Common.Workflows.ExecuteModal;
    const WorkflowsMenu = Stage.Common.Workflows.Menu;
    const DeploymentActionsMenu = Stage.Common.Deployments.ActionsMenu;
    const DeploymentActionsModals = Stage.Common.Deployments.ActionsModals;

    const [activeAction, setActiveAction, resetActiveAction] = useResettableState<string | null>(null);
    const [workflow, setWorkflow, resetWorkflow] = useResettableState<Workflow | null>(null);

    useEffect(() => {
        if (fetchedDeploymentState.status === 'error') {
            log.error('Error when fetching deployment data', fetchedDeploymentState.error);
        }
    }, [fetchedDeploymentState]);

    const buttonsDisabled = !deploymentId || ['error', 'loading'].includes(fetchedDeploymentState.status);
    const workflows = isDeploymentFetched(fetchedDeploymentState) ? fetchedDeploymentState.data.workflows : [];

    return (
        <div>
            <WorkflowsMenu
                workflows={workflows}
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
                workflows={workflows}
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
