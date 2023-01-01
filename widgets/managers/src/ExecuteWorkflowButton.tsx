import type { WorkflowsMenuProps } from '../../../app/widgets/common/executeWorkflow/WorkflowsMenu';

const WorkflowsMenu = Stage.Common.Workflows.Menu;

export default function ExecuteWorkflowButton({
    noManagers,
    onClick,
    workflows
}: {
    noManagers: boolean;
    onClick: WorkflowsMenuProps['onClick'];
    workflows: WorkflowsMenuProps['workflows'];
}) {
    const { Button, Popup } = Stage.Basic;

    return (
        <Popup on={noManagers ? 'hover' : []} open={noManagers ? undefined : false}>
            <Popup.Trigger>
                <div>
                    <WorkflowsMenu
                        workflows={workflows}
                        trigger={
                            <Button icon="cogs" content="Execute Workflow" labelPosition="left" disabled={noManagers} />
                        }
                        onClick={onClick}
                    />
                </div>
            </Popup.Trigger>

            <Popup.Content>Tick at least one manager to perform bulk workflow execution</Popup.Content>
        </Popup>
    );
}
