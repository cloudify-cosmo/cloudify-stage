import type { RouteHandler } from 'cypress/types/net-stubbing';
import { without } from 'lodash';

describe('Deployments View widget', () => {
    const widgetId = 'deploymentsView';
    const blueprintName = 'deployments_view_test_blueprint';
    const deploymentName = 'deployments_view_test_deployment';
    const siteName = 'Olsztyn';
    const blueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/simple-hello-world-example.zip';
    const widgetConfiguration = {
        filterByParentDeployment: false,
        fieldsToShow: ['status', 'name', 'blueprintName', 'location', 'subenvironmentsCount', 'subservicesCount'],
        pageSize: 100,
        pollingTime: 10,
        sortColumn: 'created_at',
        sortAscending: false
    };
    // NOTE: widgets below are shown in the details pane
    const additionalWidgetIdsToLoad = [
        'executions',
        'eventsFilter',
        'events',
        'topology',
        'outputs',
        'labels',
        'inputs',
        'blueprintSources',
        'nodes',
        'executions',
        'deploymentActionButtons'
    ];

    before(() => {
        cy.activate()
            .deleteDeployments(deploymentName, true)
            .deleteSites(siteName)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite({ name: siteName })
            .setSite(deploymentName, siteName)
            .setLabels(deploymentName, [{ 'rendered-inside': 'details-panel' }]);
    });

    const useDeploymentsViewWidget = ({
        routeHandler,
        configurationOverrides = {}
    }: { routeHandler?: RouteHandler; configurationOverrides?: Record<string, any> } = {}) => {
        cy.interceptSp('GET', /^\/deployments/, routeHandler).as('deployments');
        // NOTE: larger viewport since the widget requires more width to be comfortable to use
        cy.viewport(1600, 900)
            .usePageMock(
                [widgetId],
                { ...widgetConfiguration, ...configurationOverrides },
                { additionalWidgetIdsToLoad, widgetsWidth: 12 }
            )
            .mockLogin();
        cy.wait('@deployments');
    };

    const getDeploymentsViewWidget = () => cy.get('.deploymentsViewWidget .widgetItem');
    const getDeploymentsViewTable = () => getDeploymentsViewWidget().get('.gridTable');
    const getDeploymentsViewDetailsPane = () => getDeploymentsViewWidget().get('.detailsPane');

    const widgetConfigurationHelpers = {
        getFieldsDropdown: () => cy.contains('List of fields to show in the table').parent().find('[role="listbox"]'),
        toggleFieldsDropdown: () => widgetConfigurationHelpers.getFieldsDropdown().find('.dropdown.icon').click()
    };

    describe('configuration', () => {
        it('should allow changing displayed columns', () => {
            useDeploymentsViewWidget({
                configurationOverrides: {
                    fieldsToShow: without(widgetConfiguration.fieldsToShow, 'blueprintName', 'location')
                }
            });

            getDeploymentsViewTable().within(() => {
                cy.contains(deploymentName);
                cy.contains(blueprintName).should('not.exist');
                cy.contains(siteName).should('not.exist');
            });

            cy.log('Show some columns');
            cy.editWidgetConfiguration(widgetId, () => {
                widgetConfigurationHelpers.toggleFieldsDropdown();
                widgetConfigurationHelpers.getFieldsDropdown().within(() => {
                    cy.get('[role="option"]').contains('Blueprint Name').click();
                });
                widgetConfigurationHelpers.toggleFieldsDropdown();
            });

            getDeploymentsViewTable().within(() => {
                cy.contains(deploymentName);
                cy.contains(blueprintName);
                cy.contains(siteName).should('not.exist');
            });
        });
    });

    it('should display the deployments and content in the details pane', () => {
        useDeploymentsViewWidget();

        getDeploymentsViewTable().within(() => {
            cy.contains(deploymentName)
                .click()
                .parents('tr')
                .within(() => {
                    cy.contains(blueprintName);
                    cy.contains(siteName);
                });
        });

        cy.log('Verify details pane');
        getDeploymentsViewDetailsPane().within(() => {
            cy.contains('Deployment Info').click();
            cy.contains('rendered-inside').parents('tr').contains('details-pane');

            cy.contains('button', 'Execute workflow').click();
            // NOTE: actual workflow execution is not necessary
            cy.interceptSp('POST', /^\/executions/, {
                statusCode: 201,
                body: {}
            }).as('restartDeployment');
            cy.root().parents('body').contains('a', 'Restart').click();
            cy.root().parents('body').find('.modal').contains('button', 'Execute').click();
            cy.wait('@restartDeployment');
            cy.contains('Last Execution');
        });
    });

    it('should display various deployment information', () => {
        useDeploymentsViewWidget({
            routeHandler: {
                fixture: 'deployments/various-statuses.json'
            }
        });

        cy.log('Show all columns');
        cy.editWidgetConfiguration(widgetId, () => {
            widgetConfigurationHelpers.toggleFieldsDropdown();
            widgetConfigurationHelpers.getFieldsDropdown().within(() => {
                cy.get('[role="option"]').contains('Environment Type').click();
            });
            widgetConfigurationHelpers.toggleFieldsDropdown();
        });

        const verifyDeploymentInformation = ({ environmentType }: { environmentType: string }) => {
            cy.contains(environmentType);
        };

        getDeploymentsViewTable().within(() => {
            cy.contains('deployments_view_test_deployment')
                .parents('tr')
                .within(() => {
                    cy.get('i.exclamation[aria-label="Requires attention"]')
                        .as('requiresAttentionIcon')
                        .trigger('mouseover');
                    cy.root().parents('body').find('.popup').contains('Requires attention');
                    cy.get('@requiresAttentionIcon').trigger('mouseout');

                    verifyDeploymentInformation({
                        environmentType: 'controller'
                    });
                });

            cy.contains('hello-world-one')
                .parents('tr')
                .within(() => {
                    cy.get('i.spinner[aria-label="In progress"]').as('inProgressIcon').trigger('mouseover');
                    cy.root().parents('body').find('.popup').contains('In progress');
                    cy.get('@inProgressIcon').trigger('mouseout');

                    verifyDeploymentInformation({
                        environmentType: 'acidic'
                    });
                });

            cy.contains('one-in-warsaw')
                .parents('tr')
                .within(() => {
                    cy.get('td:nth-child(1) i').should('not.exist');

                    verifyDeploymentInformation({
                        environmentType: 'subcloud'
                    });
                });
        });
    });
});
