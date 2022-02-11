import ExecuteWorkflowModal from './ExecuteWorkflowModal';
import type { Workflow, WorkflowParameters, WorkflowOptions } from './types';

export type { Workflow, WorkflowParameters, WorkflowOptions };

declare global {
    namespace Stage.Common {
        export { ExecuteWorkflowModal };
    }
}

Stage.defineCommon({
    name: 'ExecuteWorkflowModal',
    common: ExecuteWorkflowModal
});
