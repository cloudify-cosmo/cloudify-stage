import ExecuteWorkflowModal from './ExecuteWorkflowModal';
import type { Workflow, DropdownValue, Field, WorkflowParameters, WorkflowOptions } from './types';

export type { Workflow, DropdownValue, Field, WorkflowParameters, WorkflowOptions };

declare global {
    namespace Stage.Common {
        export { ExecuteWorkflowModal };
    }
}

Stage.defineCommon({
    name: 'ExecuteWorkflowModal',
    common: ExecuteWorkflowModal
});
