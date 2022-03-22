import ExecutionUtils from 'app/utils/shared/ExecutionUtils';
import { exampleBlueprintUrl } from '../../support/resource_urls';

describe('Deployments widget', () => {
    const blueprintName = 'deployments_test_hw';
    const deploymentId = 'deployments_test_hw_dep';
    const deploymentName = `${deploymentId}_name`;
    const siteName = 'Zakopane';
    const site = { name: siteName };
    const blueprintUrl = exampleBlueprintUrl;

    const selectDeploymentActionFromMenu = (id: string, menuClassName: string, action: string) => {
        cy.searchInDeploymentsWidget(id);
        cy.contains('div.row', id).find(menuClassName).click();
        cy.get('.popupMenu > .menu').contains(action).click();
    };
    const executeDeploymentAction = (id: string, action: string) => {
        selectDeploymentActionFromMenu(id, '.deploymentActionsMenu', action);
    };
    const executeDeploymentWorkflow = (id: string, workflow: string) => {
        selectDeploymentActionFromMenu(id, '.workflowsMenu', workflow);
    };
    const verifyExecutionHasEnded = (workflow: string) => cy.waitForExecutionToEnd(workflow, { deploymentId });

    const clickConfigurationToggle = (fieldName: string) => cy.get(`input[name="${fieldName}"]`).parent().click();

    before(() => {
        cy.activate('valid_trial_license')
            .deleteSites(siteName)
            .deleteDeployments(deploymentId, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentId, { webserver_port: 9123 }, { display_name: deploymentName })
            .createSite(site)
            .usePageMock('deployments', { pollingTime: 5, clickToDrillDown: true, showExecutionStatusLabel: false })
            .mockLogin();
    });

    it('should be present in Deployments page', () => {
        cy.searchInDeploymentsWidget(deploymentId);
        cy.get('.deploymentSegment h3').should('have.text', deploymentId);
    });

    describe('should provide display configuration for', () => {
        before(cy.refreshPage);

        it('clickToDrillDown option', () => {
            cy.searchInDeploymentsWidget(deploymentId);
            cy.get('.deploymentsWidget').contains(deploymentId).click();
            cy.location('pathname').should('contain', '_deployment/deployments_test_hw_dep');
            cy.contains('.breadcrumb', 'deployments_test_hw_dep');

            cy.refreshPage();
            cy.editWidgetConfiguration('deployments', () => {
                clickConfigurationToggle('clickToDrillDown');
            });

            cy.get('.deploymentsWidget').contains(deploymentId).click();
            cy.location('pathname').should('not.contain', '_deployment/deployments_test_hw_dep');
            cy.get('.deploymentsWidget');
        });

        it('showExecutionStatusLabel option', () => {
            cy.searchInDeploymentsWidget(deploymentId);

            const lastExecutionCellSelector = 'tr#deploymentsTable_deployments_test_hw_dep td:nth-child(2)';
            cy.get(lastExecutionCellSelector).within(() => {
                cy.get('.icon').should('be.visible');
                cy.get('.label').should('not.exist');
            });

            cy.editWidgetConfiguration('deployments', () => {
                clickConfigurationToggle('showExecutionStatusLabel');
            });

            cy.searchInDeploymentsWidget(deploymentId);
            cy.get(lastExecutionCellSelector).within(() => {
                cy.get('.icon').should('be.visible');
                cy.get('.label').should('be.visible');
            });
        });

        describe('showFirstUserJourneyButtons option and', () => {
            const getMockedResponse = (deployments: unknown[] = []) => ({
                items: deployments,
                metadata: {
                    pagination: {
                        total: 0,
                        size: 1000,
                        offset: 0
                    },
                    filtered: 0
                }
            });

            const mockDeploymentsResponse = (mockedResponse: any) =>
                cy.interceptSp('POST', '/searches/deployments', mockedResponse);

            it('should display showFirstUserJourneyButtons view when there's at least one deployment installed', () => {
                const mockedResponse = getMockedResponse([]);
                mockDeploymentsResponse(mockedResponse);
                cy.editWidgetConfiguration('deployments', () => {
                    clickConfigurationToggle('showFirstUserJourneyButtons');
                });

                cy.contains('No Deployments Yet').should('be.visible');

                cy.contains('Create new Deployment').click();
                cy.contains('Blueprint marketplace')
                    .parent()
                    .within(() => {
                        cy.contains('button', 'Close').click();
                    });

                cy.contains('Upload from Terraform').click();
                cy.contains('Create blueprint from Terraform').should('be.visible');
            });

            it('should hide showFirstUserJourneyButtons view when there are installed deployments', () => {
                const mockedDeployment = {
                    blueprint_id: 'test',
                    created_at: '2022-03-21T08:52:31.251Z',
                    created_by: 'admin',
                    display_name: 'Test',
                    id: 'ea2d9302-6452-4f51-a224-803925d2cc6e',
                    inputs: { webserver_port: 8000 },
                    latest_execution: '28f3fada-118c-4236-9987-576b0efae71e',
                    site_name: null,
                    updated_at: '2022-03-21T08:52:31.251Z',
                    visibility: 'tenant'
                };
                const mockedResponse = getMockedResponse([mockedDeployment]);
                cy.interceptSp('GET', '/searches/deployments', mockedResponse).as('deployments');

                cy.editWidgetConfiguration('deployments', () => {
                    clickConfigurationToggle('showFirstUserJourneyButtons');
                });

                cy.contains('No Deployments Yet').should('not.exist');
            });
        });

        it('blueprintIdFilter option', () => {
            cy.interceptSp('GET', { pathname: '/deployments', query: { blueprint_id: blueprintName } }).as(
                'getFilteredDeployments'
            );

            cy.refreshPage();

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('input[name="blueprintIdFilter"]').clear().type(blueprintName);
            });

            cy.wait('@getFilteredDeployments');
        });

        it('displayStyle option', () => {
            cy.get('table.deploymentsTable').should('be.visible');
            cy.get('div.segmentList').should('not.exist');

            cy.editWidgetConfiguration('deployments', () => {
                cy.get('div[name="displayStyle"]').click();
                cy.get('div[option-value="list"]').click();
            });

            cy.get('table.deploymentsTable').should('not.exist');
            cy.get('div.segmentList').should('be.visible');
        });
    });

    describe('should allow to execute', () => {
        const startAndVerifyWorkflowExecution = (workflow: string) => {
            cy.get('.executeWorkflowModal').within(() => {
                cy.contains(`Execute workflow ${workflow} on ${deploymentName} (${deploymentId})`);
                cy.get('button.ok').click();
            });
            verifyExecutionHasEnded(workflow);
        };

        it('install workflow from deployment actions menu', () => {
            executeDeploymentAction(deploymentId, 'Install');
            startAndVerifyWorkflowExecution('install');
        });

        it('a workflow from workflows menu', () => {
            executeDeploymentWorkflow(deploymentId, 'Restart');
            startAndVerifyWorkflowExecution('restart');
        });
    });

    it('should allow to set site for deployment', () => {
        cy.interceptSp('POST', `/deployments/${deploymentId}/set-site`).as('setDeploymentSite');

        executeDeploymentAction(deploymentId, 'Set Site');

        cy.get('.modal').within(() => {
            cy.contains(`Set the site of deployment ${deploymentName} (${deploymentId})`);
            cy.get('div[name="siteName"]').click();
            cy.get(`div[option-value="${siteName}"]`).click();
            cy.get('button.ok').click();
        });

        cy.wait('@setDeploymentSite');
        cy.contains('div.row', deploymentId)
            .find('div.column:nth-child(2) h5:nth-child(2) .sub.header')
            .should('have.text', siteName);
    });

    it('should allow to update deployment', () => {
        cy.interceptSp('PUT', `/deployment-updates/${deploymentId}/update/initiate`).as('updateDeployment');

        cy.interceptSp('GET', { pathname: '/blueprints', query: { state: 'uploaded' } }).as('uploadedBlueprints');
        executeDeploymentAction(deploymentId, 'Update');

        cy.get('.updateDeploymentModal').within(() => {
            cy.contains(`Update deployment ${deploymentName} (${deploymentId})`);
            cy.get('div[name=blueprintName]').click();
            cy.wait('@uploadedBlueprints');
            cy.get('textarea[name="webserver_port"]').clear({ force: true }).type('9321');
            cy.get('button.blue.ok').click();
        });

        cy.get('.updateDetailsModal').within(() => {
            cy.contains('tr', 'webserver_port').within(() => {
                cy.get('td:nth-child(2)').should('have.text', '9123');
                cy.get('td:nth-child(3)').should('have.text', '9321');
            });
            cy.get('button.ok').click();
        });

        cy.wait('@updateDeployment');
        cy.get('.updateDetailsModal').should('not.exist');
        verifyExecutionHasEnded(ExecutionUtils.UPDATE_WORKFLOW_ID);
        cy.contains('div.row', deploymentId)
            .get('div.column:nth-child(3) h5:nth-child(2)')
            .should('contain.text', 'Updated');
    });

    it('should allow to manage deployment labels', () => {
        const labelKey = 'test-key';
        const labelValue = 'test-value';

        cy.setLabels(deploymentId, [{ a: 'b' }]);
        cy.interceptSp('PATCH', `/deployments/${deploymentId}`).as('updateLabels');
        cy.interceptSp('GET', { path: `/deployments/${deploymentId}?_include=labels` }).as('fetchLabels');
        cy.interceptSp('GET', `/labels/deployments`).as('checkLabelPresence');

        const typeInput = (name: string, value: string) => {
            cy.get(`div[name=${name}]`).click();
            cy.get(`div[name=${name}] input`).type(value);
        };
        executeDeploymentAction(deploymentId, 'Manage Labels');
        cy.get('.modal').within(() => {
            cy.contains(`Manage labels for deployment ${deploymentName} (${deploymentId})`);
            cy.wait('@fetchLabels');
            cy.get('form.loading').should('not.exist');

            cy.get('.segment.dropdown').click();
            typeInput('labelKey', labelKey);
            typeInput('labelValue', labelValue);
            cy.get('button .add').click();

            cy.wait('@checkLabelPresence');
            cy.get('.blue.label').should('have.text', `${labelKey} ${labelValue}`);

            cy.get('button.ok').click();
        });
        cy.wait('@updateLabels');

        cy.getDeployment(deploymentId).then(response => {
            const { labels } = response.body;
            const verifyLabel = (index: number, key: string, value: string) => {
                expect(labels[index]).to.have.property('key', key);
                expect(labels[index]).to.have.property('value', value);
            };

            expect(labels).to.have.length(2);
            verifyLabel(0, 'a', 'b');
            verifyLabel(1, labelKey, labelValue);
        });
    });

    it('should allow to remove deployment', () => {
        const testDeploymentId = `${deploymentId}_remove_id`;
        const testDeploymentName = `${deploymentId}_remove_name`;
        cy.deployBlueprint(blueprintName, testDeploymentId, {}, { display_name: testDeploymentName });
        cy.interceptSp('DELETE', { path: `/deployments/${testDeploymentId}?force=true` }).as('deleteDeployment');

        executeDeploymentAction(testDeploymentId, 'Force Delete');

        cy.contains(
            `Are you sure you want to ignore the live nodes and delete the deployment ${testDeploymentName} (${testDeploymentId})?`
        );
        cy.get('.modal button.primary').click();

        cy.wait('@deleteDeployment');
        cy.contains('div.row', testDeploymentId).should('not.exist');
    });
});
