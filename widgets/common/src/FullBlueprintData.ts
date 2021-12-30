/* eslint-disable camelcase */

interface FullBlueprintData {
    id: string;
    visibility: string;
    created_at: string;
    main_file_name: string;
    plan: {
        description: null | unknown;
        metadata: null | unknown;
        nodes: unknown[];
        relationships: { [key: string]: unknown };
        workflows: { [key: string]: unknown };
        policy_types: { [key: string]: unknown };
        policy_triggers: { [key: string]: unknown };
        policies: { [key: string]: unknown };
        groups: { [key: string]: unknown };
        scaling_groups: { [key: string]: unknown };
        inputs: { [key: string]: unknown };
        outputs: { [key: string]: unknown };
        deployment_plugins_to_install: unknown[];
        workflow_plugins_to_install: unknown[];
        host_agent_plugins_to_install: unknown[];
        version: {
            raw: string;
            definitions_name: string;
            definitions_version: number[];
        };
        capabilities: { [key: string]: unknown };
        imported_blueprints: unknown[];
        namespaces_mapping: { [key: string]: unknown };
        data_types: {
            derived_from: string;
            version: string;
            properties: {
                description: string;
                type: string;
                default: unknown;
                required: boolean;
            };
        };
        labels: { [key: string]: unknown };
        blueprint_labels: { [key: string]: unknown };
        deployment_settings: { [key: string]: unknown };
    };
    updated_at: string;
    description: null | unknown;
    is_hidden: boolean;
    state: string;
    error: null | string;
    error_traceback: null | unknown;
    tenant_name: string;
    created_by: string;
    resource_availability: string;
    private_resource: false;
    labels: [];
    upload_execution: {
        visibility: string;
        created_at: string;
        id: string;
        ended_at: string;
        error: string;
        is_system_workflow: false;
        parameters: {
            blueprint_id: string;
            app_file_name: string;
            url: null | unknown;
            file_server_root: string;
            validate_only: false;
            labels: null | unknown;
        };
        status: string;
        workflow_id: string;
        started_at: string;
        scheduled_for: null | unknown;
        is_dry_run: false;
        resume: false;
        total_operations: number;
        finished_operations: number;
        allow_custom_parameters: true;
        blueprint_id: null | unknown;
        execution_group_id: string;
        deployment_display_name: null | unknown;
        deployment_id: null | unknown;
        status_display: string;
        tenant_name: string;
        created_by: string;
        resource_availability: string;
        private_resource: false;
    };
}

declare global {
    namespace Stage.Common {
        // eslint-disable-next-line import/prefer-default-export
        export type { FullBlueprintData };
    }
}

export {};
