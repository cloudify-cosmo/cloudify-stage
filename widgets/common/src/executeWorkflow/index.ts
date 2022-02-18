import ExecuteWorkflowModal from './ExecuteWorkflowModal';
import ExecuteWorkflowInputs from './ExecuteWorkflowInputs';
import { getWorkflowName, executeWorkflow } from './common';
import type {
    Workflow,
    WorkflowParameters,
    WorkflowOptions,
    BaseWorkflowInputs,
    UserWorkflowInputsState
} from './types';

export type { Workflow, WorkflowParameters, WorkflowOptions, BaseWorkflowInputs, UserWorkflowInputsState };

export { ExecuteWorkflowInputs, getWorkflowName, executeWorkflow };

declare global {
    namespace Stage.Common {
        export { ExecuteWorkflowModal };
    }
}

Stage.defineCommon({
    name: 'ExecuteWorkflowModal',
    common: ExecuteWorkflowModal
});
