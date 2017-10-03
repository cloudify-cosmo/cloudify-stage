/**
 * Created by kinneretzin on 11/01/2017.
 */

export default {
    CONTEXT_PATH: '/stage',

    DEFAULT_TENANT: 'default_tenant',
    MODE_MAIN: 'main',
    MODE_CUSTOMER: 'customer',
    permissions: {
        STAGE_SERVICES_STATUS: 'stage-services-status',
        STAGE_EDIT_MODE: 'stage-edit-mode',
        STAGE_MAINTENANCE_MODE: 'stage-maintenance-mode',
        STAGE_CONFIGURE: 'stage-configure',
        STAGE_TEMPLATE_MANAGEMENT: 'stage-template-management'
    },
    MANAGER_RUNNING: 'running',
    MAINTENANCE_ACTIVATING: 'activating',
    MAINTENANCE_ACTIVATED: 'activated',
    MAINTENANCE_DEACTIVATED: 'deactivated',
    DEFAULT_INITIAL_TEMPLATE: 'initial-template',
    DEFAULT_ALL: '*'
};
