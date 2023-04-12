/* eslint-disable camelcase */

export interface CloudifyEventPart {
    type: 'cloudify_event';
    event_type: string;
}

export interface CloudifyLogEventPart {
    type: 'cloudify_log';
    level: string;
}

export type Event = {
    _storage_id: string;
    blueprint_id: string;
    deployment_display_name: string;
    deployment_id: string;
    error_causes: { message: string; traceback: string; type: string }[] | null;
    execution_id: string;
    message: string;
    node_instance_id: string;
    node_name: string;
    operation: string;
    reported_timestamp: string;
    workflow_id: string;
} & (CloudifyEventPart | CloudifyLogEventPart);
