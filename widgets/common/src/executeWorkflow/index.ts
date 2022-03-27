import ExecuteWorkflowModal from './ExecuteWorkflowModal';
import ExecuteWorkflowInputs from './ExecuteWorkflowInputs';
import Menu from './WorkflowsMenu';
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

const WorkflowsCommon = {
    ExecuteModal: ExecuteWorkflowModal,
    Menu
};

declare global {
    namespace Stage.Common {
        const Workflows: typeof WorkflowsCommon;
    }
}

Stage.defineCommon({
    name: 'Workflows',
    common: WorkflowsCommon
});
