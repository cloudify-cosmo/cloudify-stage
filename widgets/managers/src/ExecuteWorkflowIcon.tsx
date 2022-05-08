import type { ComponentProps } from 'react';

const WorkflowsMenu = Stage.Common.Workflows.Menu;

export default function ExecuteWorkflowIcon({
    onClick = _.noop,
    workflows = []
}: {
    onClick?: (workflow: Parameters<ComponentProps<typeof WorkflowsMenu>['onClick']>[0]) => void;
    workflows: ComponentProps<typeof WorkflowsMenu>['workflows'];
}) {
    return !_.isEmpty(workflows) ? (
        <WorkflowsMenu workflows={workflows} onClick={workflow => onClick(workflow)} />
    ) : null;
}
