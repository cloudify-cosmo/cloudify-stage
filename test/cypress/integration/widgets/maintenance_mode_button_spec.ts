import Consts from 'app/utils/consts';
import { waitUntil } from '../../support/resource_commons';

describe('Maintenance mode button widget', { retries: { runMode: 2 } }, () => {
    before(() => cy.activate('valid_trial_license'));
    beforeEach(() => deactivateMaintenanceMode().usePageMock('maintenanceModeButton', { pollingTime: 2 }).mockLogin());

    const getActivateButton = () => cy.contains('Activate Maintenance Mode');
    const getDeactivateButton = () => cy.contains('Deactivate Maintenance Mode');

    const deactivateMaintenanceMode = () =>
        cy
            .cfyRequest('/maintenance/deactivate', 'POST', null, null, { useAdminAuthorization: true })
            .then(() => waitForMaintenanceModeStatus('deactivated'));
    const waitForMaintenanceModeStatus = (status: 'activated' | 'deactivated') =>
        waitUntil('maintenance', response => response.body.status === status, { useAdminAuthorization: true });

    it('should enter maintenance mode on click', () => {
        cy.killRunningExecutions();

        getActivateButton().click();
        cy.contains('Yes').click();
        cy.contains('Server is on maintenance mode').should('be.visible');
        waitForMaintenanceModeStatus('activated');

        getDeactivateButton().click();
        cy.contains('Yes').click();
        waitForMaintenanceModeStatus('deactivated');
        cy.location('pathname').should('be.equal', '/console/');
    });

    it('should show information when there are active executions', () => {
        cy.interceptSp('GET', '/executions', {
            body: {
                items: [
                    {
                        visibility: 'tenant',
                        created_at: '2021-05-28T10:25:52.447Z',
                        id: 'b788f0f6-bff1-4d12-9811-8c5718a33d56',
                        ended_at: '2021-05-28T10:25:56.616Z',
                        error: '',
                        is_system_workflow: false,
                        parameters: {
                            blueprint_id: 'Cloudify-Hello-World',
                            app_file_name: 'blueprint.yaml',
                            url:
                                'https://github.com/cloudify-community/blueprint-examples/releases/latest/download/simple-hello-world-example.zip',
                            file_server_root: '/opt/manager/resources',
                            validate_only: false,
                            labels: null
                        },
                        status: 'terminated',
                        workflow_id: 'upload_blueprint',
                        started_at: '2021-05-28T10:25:53.816Z',
                        scheduled_for: null,
                        is_dry_run: false,
                        resume: false,
                        total_operations: 0,
                        finished_operations: 0,
                        allow_custom_parameters: true,
                        blueprint_id: null,
                        deployment_id: null,
                        status_display: 'completed',
                        tenant_name: Consts.DEFAULT_TENANT,
                        created_by: 'admin',
                        resource_availability: 'tenant',
                        private_resource: false
                    }
                ],
                metadata: {
                    pagination: {
                        total: 1,
                        size: 1000,
                        offset: 0
                    },
                    filtered: null
                }
            }
        });
        getActivateButton().click();
        cy.contains('There are active executions');
    });

    it('should disable the button when maintenance mode is being activated', () => {
        cy.interceptSp('GET', '/maintenance', {
            body: {
                status: 'deactivated',
                activated_at: '',
                activation_requested_at: '2021-05-28T15:50:40.144Z',
                remaining_executions: null,
                requested_by: 'admin'
            }
        });

        getDeactivateButton()
            .should('be.disabled')
            .parent()
            .should('have.attr', 'title', 'Maintenance Mode is being activated');
    });
});
