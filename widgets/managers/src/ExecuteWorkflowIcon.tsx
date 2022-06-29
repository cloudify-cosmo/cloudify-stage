import { isEmpty, noop } from 'lodash';
import type { WorkflowsMenuProps } from '../../common/src/executeWorkflow/WorkflowsMenu';

const WorkflowsMenu = Stage.Common.Workflows.Menu;

export default function ExecuteWorkflowIcon({
    onClick = noop,
    workflows = []
}: {
    onClick?: WorkflowsMenuProps['onClick'];
    workflows: WorkflowsMenuProps['workflows'];
}) {
    return !isEmpty(workflows) ? <WorkflowsMenu workflows={workflows} onClick={onClick} /> : null;
}
