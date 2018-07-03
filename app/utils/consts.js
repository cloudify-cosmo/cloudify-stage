/**
 * Created by kinneretzin on 11/01/2017.
 */

export default {
    CONTEXT_PATH: '/console',

    ERROR_404_PAGE_PATH: '/404',
    ERROR_NO_TENANTS_PAGE_PATH: '/noTenants',
    ERROR_PAGE_PATH: '/error',
    LOGIN_PAGE_PATH: '/login',
    LOGOUT_PAGE_PATH: '/logout',
    MAINTENANCE_PAGE_PATH: '/maintenance',

    DEFAULT_TENANT: 'default_tenant',
    MODE_MAIN: 'main',
    MODE_CUSTOMER: 'customer',
    permissions: {
        STAGE_SERVICES_STATUS: 'stage_services_status',
        STAGE_EDIT_MODE: 'stage_edit_mode',
        STAGE_INSTALL_WIDGETS: 'stage_install_widgets',
        STAGE_MAINTENANCE_MODE: 'stage_maintenance_mode',
        STAGE_CONFIGURE: 'stage_configure',
        STAGE_TEMPLATE_MANAGEMENT: 'stage_template_management',
        CREATE_GLOBAL_RESOURCE: 'create_global_resource'
    },
    visibility: {
        PRIVATE: {name: 'private', icon: 'lock', color: 'red', title: 'Private resource'},
        TENANT: {name: 'tenant', icon: 'user', color: 'green', title: 'Tenant resource'},
        GLOBAL: {name: 'global', icon: 'globe', color: 'blue', title: 'Global resource'}
    },
    MANAGER_RUNNING: 'running',
    MAINTENANCE_ACTIVATING: 'activating',
    MAINTENANCE_ACTIVATED: 'activated',
    MAINTENANCE_DEACTIVATED: 'deactivated',
    DEFAULT_INITIAL_TEMPLATE: 'initial-template',
    DEFAULT_ALL: '*',
    PAGE_MANAGEMENT_VIEW: 'view',
    PAGE_MANAGEMENT_EDIT: 'edit',
    PRIVATE_RESOURCE: 'private',
    WIDGET_ID_HEADER: 'widget-id',
    USER_DATA_PATH: '/userData'
};
