/**
 * Created by pposel on 07/02/2017.
 */

import { icons } from 'cloudify-ui-common';

class EventUtils {
    static eventType = 'cloudify_event';
    static logType = 'cloudify_log';
    static typesOptions = [{text: '', value: ''}, {text: 'Logs', value: EventUtils.logType}, {text: 'Events', value: EventUtils.eventType}];

    static eventTypeOptions = {
        'workflow_received': {
            text: 'Workflow received'
        },
        'workflow_started': {
            text: 'Workflow started',
            iconClass: 'blue'
        },
        'workflow_initializing_policies': {
            text: 'Workflow initializing policies'
        },
        'workflow_initializing_node': {
            text: 'Workflow initializing node'
        },
        'workflow_succeeded': {
            text: 'Workflow ended successfully',
            iconClass: 'green',
        },
        'workflow_failed': {
            text: 'Workflow failed',
            iconClass: 'red',
            rowClass: 'row-error'
        },
        'workflow_cancelled': {
            text: 'Workflow cancelled',
            iconClass: 'red',
            rowClass: 'row-error'
        },
        'workflow_stage': {
            text: 'Workflow staged'
        },
        'task_started': {
            text: 'Task started',
            iconClass: 'blue'
        },
        'sending_task': {
            text: 'Task sent',
            iconClass: 'blue'
        },
        'task_received': {
            text: 'Task received',
            iconClass: 'blue'
        },
        'task_succeeded': {
            text: 'Task ended successfully',
            iconClass: 'green'
        },
        'task_failed': {
            text: 'Task failed',
            iconClass: 'red',
            rowClass: 'row-error'
        },
        'task_rescheduled': {
            text: 'Task rescheduled',
            iconClass: 'yellow',
            rowClass: 'row-error'
        },
        'task_retried': {
            text: 'Task retried',
            iconClass: 'yellow',
            rowClass: 'row-error'
        },
        'policy_success': {
            text: 'Policy end successfully started',
            iconClass: 'green',
        },
        'policy_failed': {
            text: 'Policy failed',
            iconClass: 'red',
            rowClass: 'row-error'
        },
        'workflow_node_event': {
            text: 'Workflow node event'
        },
        'processing_trigger': {
            text: 'Processing trigger'
        },
        'trigger_failed': {
            text: 'Trigger failed',
            iconClass: 'red',
        },
        'trigger_succeeded': {
            text: 'Trigger succeeded',
            iconClass: 'green',
        },
        'workflow_event': {
            text: 'Workflow event'
        }
    };

    static logLevelOptions = {
        'debug': {
            icon: 'bug',
            color: 'green',
            rowClass: 'row-debug',
            text: 'Debug'
        },
        'info': {
            icon: 'info',
            color: 'blue',
            text: 'Info'
        },
        'warning': {
            icon: 'warning sign',
            color: 'yellow',
            rowClass: 'row-warning',
            text: 'Warning'
        },
        'error': {
            icon: 'remove',
            color: 'red',
            rowClass: 'row-error',
            text: 'Error'
        },
        'critical': {
            icon: 'warning',
            color: 'red',
            rowClass: 'row-error',
            text: 'Critical'
        }
    };

    static getEventTypeOptions(event) {
        return {...{iconChar: icons.getEventIcon(event)}, ...EventUtils.eventTypeOptions[event]};
    }

    static getLogLevelOptions(log) {
        return {...{icon: 'question', color: 'orange'}, ...EventUtils.logLevelOptions[log]};
    }
}

Stage.defineCommon({
    name: 'EventUtils',
    common: EventUtils
});