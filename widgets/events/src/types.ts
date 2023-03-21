const { EventUtils } = Stage.Common;

/* eslint-disable camelcase */

interface CloudifyEventPart {
    type: 'cloudify_event';
    event_type: string;
}

interface CloudifyLogEventPart {
    type: 'cloudify_log';
    level: string;
}

export type Event = {
    error_causes: { message: string; traceback: string; type: string }[];
    message: any;
    id: string;
    isSelected: boolean;
    timestamp: string;
    blueprint_id: string;
    deployment_display_name: string;
    deployment_id: string;
    node_name: string;
    node_instance_id: string;
    workflow_id: string;
    operation: string;
} & (CloudifyEventPart | CloudifyLogEventPart);

export function isEventType(event: Event): event is Event & CloudifyEventPart {
    return event.type === EventUtils.eventType;
}

/* eslint-enable camelcase */
