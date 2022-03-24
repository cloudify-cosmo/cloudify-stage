import type { ComponentProps } from 'react';

const WorkflowsMenu = Stage.Common.Workflows.Menu;

export default function ExecuteWorkflowButton({
    noManagers,
    onClick,
    workflows
}: {
    noManagers: boolean;
    onClick: (workflow: Parameters<ComponentProps<typeof WorkflowsMenu>['onClick']>[0]) => void;
    workflows: ComponentProps<typeof WorkflowsMenu>['workflows'];
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
                        onClick={workflow => onClick(workflow)}
                    />
                </div>
            </Popup.Trigger>

            <Popup.Content>Tick at least one manager to perform bulk workflow execution</Popup.Content>
        </Popup>
    );
}
