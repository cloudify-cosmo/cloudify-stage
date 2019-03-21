export default {
    "roles": [
            {
                "type": "system_role",
                "name": "sys_admin",
                "description": "User that can manage Cloudify"
            },
            {
                "type": "tenant_role",
                "name": "manager",
                "description": "User that can manage tenants"
            },
            {
                "type": "tenant_role",
                "name": "user",
                "description": "Regular user, can perform actions on tenants resources"
            },
            {
                "type": "tenant_role",
                "name": "operations",
                "description": "User that can deploy and execute workflows, but cannot manage blueprints or plugins."
            },
            {
                "type": "tenant_role",
                "name": "viewer",
                "description": "User that can only view tenant resources"
            },
            {
                "type": "system_role",
                "name": "default",
                "description": "User exists, but have no permissions"
            }
        ],
    "permissions": {
            "operations": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_blueprintSources": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "plugin_delete": [
                "sys_admin",
                "manager",
                "user"
            ],
            "secret_update": [
                "sys_admin",
                "manager",
                "user"
            ],
            "deployment_update_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "deployment_capabilities": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "deployment_delete": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "stage_services_status": [
                "sys_admin"
            ],
            "widget_pluginUploadButton": [
                "sys_admin",
                "manager",
                "user"
            ],
            "version_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "secret_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_nodesComputeNum": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "node_instance_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "tenant_get": [
                "sys_admin",
                "manager"
            ],
            "license_upload": [
                "sys_admin"
            ],
            "plugin_upload": [
                "sys_admin",
                "manager",
                "user"
            ],
            "deployment_set_visibility": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "create_global_resource": [
                "sys_admin"
            ],
            "widget_inputs": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "deployment_modify": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "widget_custom_all": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_eventsFilter": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_timeFilter": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "user_delete": [
                "sys_admin"
            ],
            "user_set_activated": [
                "sys_admin"
            ],
            "widget_filter": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_topology": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "stage_install_widgets": [
                "sys_admin"
            ],
            "widget_blueprintUploadButton": [
                "sys_admin",
                "manager",
                "user"
            ],
            "execution_start": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "stage_edit_mode": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "event_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "deployment_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "snapshot_create": [
                "sys_admin"
            ],
            "user_get_self": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "agent_update": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "deployment_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_maintenanceModeButton": [
                "sys_admin"
            ],
            "blueprint_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "agent_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "ssl_set": [
                "sys_admin"
            ],
            "widget_blueprints": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "tenant_add_group": [
                "sys_admin"
            ],
            "deployment_modification_rollback": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "blueprint_upload": [
                "sys_admin",
                "manager",
                "user"
            ],
            "user_get": [
                "sys_admin"
            ],
            "event_delete": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "deployment_modification_finish": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "secret_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "provider_context_create": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "widget_blueprintCatalog": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_blueprintNum": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "user_group_delete": [
                "sys_admin"
            ],
            "deployment_create": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "widget_blueprintInfo": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "blueprint_download": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "deployment_update_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "tenant_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "deployment_modification_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_deploymentButton": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "widget_composerLink": [
                "sys_admin",
                "manager",
                "user"
            ],
            "token_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "widget_snapshots": [
                "sys_admin"
            ],
            "tenant_remove_group": [
                "sys_admin"
            ],
            "functions_evaluate": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "snapshot_list": [
                "sys_admin"
            ],
            "tenant_delete": [
                "sys_admin"
            ],
            "widget_pluginsNum": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "cluster_config_update": [
                "sys_admin"
            ],
            "plugin_download": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "snapshot_download": [
                "sys_admin"
            ],
            "execution_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "deployment_modification_outputs": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "secret_delete": [
                "sys_admin",
                "manager",
                "user"
            ],
            "stage_template_management": [
                "sys_admin"
            ],
            "stage_configure": [
                "sys_admin"
            ],
            "execution_status_update": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "execution_should_start": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_deploymentActionButtons": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "maintenance_mode_set": [
                "sys_admin"
            ],
            "widget_buttonLink": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_events": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "user_group_list": [
                "sys_admin"
            ],
            "file_server_auth": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "user_group_update": [
                "sys_admin"
            ],
            "user_token": [
                "sys_admin"
            ],
            "cluster_node_remove": [
                "sys_admin"
            ],
            "resource_set_global": [
                "sys_admin"
            ],
            "tenant_update_user": [
                "sys_admin"
            ],
            "deployment_update_create": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "resource_set_visibility": [
                "sys_admin",
                "manager",
                "user"
            ],
            "tenant_remove_user": [
                "sys_admin"
            ],
            "snapshot_status_update": [
                "sys_admin"
            ],
            "manager_config_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "widget_executions": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "cluster_node_config_update": [
                "sys_admin"
            ],
            "user_group_create": [
                "sys_admin"
            ],
            "user_group_add_user": [
                "sys_admin"
            ],
            "widget_custom_sys_admin": [
                "sys_admin"
            ],
            "agent_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_highAvailability": [
                "sys_admin"
            ],
            "widget_tenants": [
                "sys_admin"
            ],
            "widget_blueprintActionButtons": [
                "sys_admin",
                "manager",
                "user"
            ],
            "execution_cancel": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "widget_custom_admin": [
                "sys_admin",
                "manager"
            ],
            "widget_managers": [
                "sys_admin"
            ],
            "maintenance_mode_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "cluster_status_get": [
                "sys_admin"
            ],
            "snapshot_upload": [
                "sys_admin"
            ],
            "license_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "node_instance_update": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "plugin_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "administrators": [
                "sys_admin",
                "manager"
            ],
            "cluster_start_or_join": [
                "sys_admin"
            ],
            "manager_rest_config_get": [
                "sys_admin"
            ],
            "widget_deploymentWizardButtons": [
                "sys_admin",
                "manager",
                "user"
            ],
            "deployment_modification_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_agents": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "secret_create": [
                "sys_admin",
                "manager",
                "user"
            ],
            "ssl_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "status_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "execution_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "ldap_set": [
                "sys_admin"
            ],
            "cluster_node_validate": [
                "sys_admin"
            ],
            "snapshot_restore": [
                "sys_admin"
            ],
            "widget_pluginsCatalog": [
                "sys_admin",
                "manager",
                "user"
            ],
            "widget_onlyMyResources": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "snapshot_get": [
                "sys_admin"
            ],
            "node_instance_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_text": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "provider_context_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "blueprint_delete": [
                "sys_admin",
                "manager",
                "user"
            ],
            "widget_secrets": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_plugins": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "blueprint_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_userManagement": [
                "sys_admin"
            ],
            "cluster_node_list": [
                "sys_admin"
            ],
            "tenant_rabbitmq_credentials": [
                "sys_admin",
                "manager"
            ],
            "user_update": [
                "sys_admin"
            ],
            "cluster_node_get": [
                "sys_admin"
            ],
            "tenant_create": [
                "sys_admin"
            ],
            "node_list": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "tenant_list_get_data": [
                "sys_admin"
            ],
            "widget_executionNum": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_deploymentNum": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_outputs": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "tenant_add_user": [
                "sys_admin"
            ],
            "widget_serversNum": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_nodesStats": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "tenant_update_group": [
                "sys_admin"
            ],
            "stage_maintenance_mode": [
                "sys_admin"
            ],
            "user_group_remove_user": [
                "sys_admin"
            ],
            "widget_deployments": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "widget_graph": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "agent_create": [
                "sys_admin",
                "manager",
                "user",
                "operations"
            ],
            "widget_userGroups": [
                "sys_admin"
            ],
            "user_create": [
                "sys_admin"
            ],
            "all_tenants": [
                "sys_admin"
            ],
            "plugin_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ],
            "user_unlock": [
                "sys_admin"
            ],
            "snapshot_delete": [
                "sys_admin"
            ],
            "user_group_get": [
                "sys_admin"
            ],
            "ldap_status_get": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer",
                "default"
            ],
            "user_list": [
                "sys_admin"
            ],
            "widget_nodes": [
                "sys_admin",
                "manager",
                "user",
                "operations",
                "viewer"
            ]
        }
}
