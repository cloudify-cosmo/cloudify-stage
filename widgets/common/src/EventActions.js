/**
 * Created by pposel on 07/02/2017.
 */

const eventsMap = {
    'workflow_received': {
        text: 'Workflow received',
        icon: 'icon-gs-workflow-stage',
    },
    'workflow_started': {
        text: 'Workflow started',
        icon: 'icon-gs-workflow-started',
    },
    'workflow_initializing_policies': {
        text: 'Workflow initializing policies',
        icon: 'icon-gs-workflow-stage',
    },
    'workflow_initializing_node': {
        text: 'Workflow initializing node',
        icon: 'icon-gs-workflow-stage',
    },
    'workflow_succeeded': {
        text: 'Workflow ended successfully',
        icon: 'icon-gs-workflow-success',
    },
    'workflow_failed': {
        text: 'Workflow failed',
        icon: 'icon-gs-workflow-failed',
        class: 'row-error'
    },
    'workflow_cancelled': {
        text: 'Workflow cancelled',
        icon: 'icon-gs-workflow-cancelled',
        class: 'row-error'
    },
    'workflow_stage': {
        text: 'Workflow staged',
        icon: 'icon-gs-workflow-stage',
    },
    'task_started': {
        text: 'Task started',
        icon: 'icon-gs-task-started',
    },
    'sending_task': {
        text: 'Task sent',
        icon: 'icon-gs-task-sent',
    },
    'task_received': {
        text: 'Task received',
        icon: 'icon-gs-task-recieved',
    },
    'task_succeeded': {
        text: 'Task ended successfully',
        icon: 'icon-gs-task-success',
    },
    'task_failed': {
        text: 'Task failed',
        icon: 'icon-gs-task-failed',
        class: 'row-error'
    },
    'task_rescheduled': {
        text: 'Task rescheduled',
        icon: 'icon-gs-task-retry',
        class: 'row-error'
    },
    'task_retried': {
        text: 'Task retried',
        icon: 'icon-gs-task-retried',
        class: 'row-error'
    },
    'policy_success': {
        text: 'Policy end successfully started',
        icon: 'icon-gs-policy-success',
    },
    'policy_failed': {
        text: 'Policy failed',
        icon: 'icon-gs-policy-failed',
        class: 'row-error'
    },
    'workflow_node_event': {
        text: 'Workflow node event'
    },
    'processing_trigger': {
        text: 'Processing trigger'
    },
    'trigger_failed': {
        text: 'Trigger failed'
    },
    'trigger_succeeded': {
        text: 'Trigger succeeded'
    },
    'workflow_event': {
        text: 'Workflow event'
    },
    'debug': {
        icon: 'icon info circle blue large',
        class: 'row-debug',
        text: 'Debug'
    },
    'info': {
        icon: 'icon info circle green large',
        text: 'Info'
    },
    'warning': {
        icon: 'icon warning sign yellow large',
        class: 'row-warning',
        text: 'Warning'
    },
    'error': {
        icon: 'icon warning circle red large',
        class: 'row-error',
        text: 'Error'
    },
    'critical': {
        icon: 'icon remove circle red large',
        class: 'row-error',
        text: 'Critical'
    }
};

class EventActions {

    getEventDef(event) {
        return {...{text: event, icon: 'icon calendar outline large', class: 'info'}, ...eventsMap[event]};
    }

}

Stage.defineCommon({
    name: 'EventActions',
    common: EventActions
});