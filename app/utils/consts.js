/**
 * Created by kinneretzin on 11/01/2017.
 */

export default {
    CONTEXT_PATH: '/console',

    ERROR_404_PAGE_PATH: '/404',
    ERROR_NO_TENANTS_PAGE_PATH: '/noTenants',
    ERROR_PAGE_PATH: '/error',
    HOME_PAGE_PATH: '/',
    LOGIN_PAGE_PATH: '/login',
    LOGOUT_PAGE_PATH: '/logout',
    MAINTENANCE_PAGE_PATH: '/maintenance',
    LICENSE_PAGE_PATH: '/license',

    USER_DATA_PATH: '/userData',
    APP_DATA_PATH: '/appData',

    TOKEN_COOKIE_NAME: 'XSRF-TOKEN',

    EDITION: {
        PREMIUM: 'premium',
        COMMUNITY: 'community'
    },

    LICENSE: {
        EMPTY: 'no_license',
        EXPIRED: 'expired_license',
        ACTIVE: 'active_license'
    },
    NO_LICENSE_ERROR_CODE: 'missing_cloudify_license',
    EXPIRED_LICENSE_ERROR_CODE: 'expired_cloudify_license',

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
        CREATE_GLOBAL_RESOURCE: 'create_global_resource',
        LICENSE_LIST: 'license_list',
        LICENSE_UPLOAD: 'license_upload'
    },

    GLOBAL_VISIBILITY: 'global',

    MANAGER_STATUS_OK: 'OK',
    MANAGER_STATUS_FAIL: 'FAIL',
    MAINTENANCE_ACTIVATING: 'activating',
    MAINTENANCE_ACTIVATED: 'activated',
    MAINTENANCE_DEACTIVATED: 'deactivated',

    DEFAULT_ALL: '*',
    PAGE_MANAGEMENT_VIEW: 'view',
    PAGE_MANAGEMENT_EDIT: 'edit',
    PRIVATE_RESOURCE: 'private',
    WIDGET_ID_HEADER: 'widget-id'
};
