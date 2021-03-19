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

    before(() => {
        cy.activate()
            .deleteDeployments(deploymentName, true)
            .deleteSites(siteName)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite({ name: siteName })
            .setSite(deploymentName, siteName);
    });

    const useDeploymentsViewWidget = ({
        routeHandler,
        configurationOverrides = {}
    }: { routeHandler?: RouteHandler; configurationOverrides?: Record<string, any> } = {}) => {
        cy.interceptSp('GET', 'deployments', routeHandler).as('deployments');
        cy.usePageMock([widgetId], { ...widgetConfiguration, ...configurationOverrides }).mockLogin();
        cy.wait('@deployments');
    };

    const getDeploymentsViewTable = () => cy.get('.deploymentsViewWidget .widgetItem');

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

    it('should display the deployments', () => {
        useDeploymentsViewWidget();

        getDeploymentsViewTable().within(() => {
            cy.contains(deploymentName);
            cy.contains(blueprintName);
            cy.contains(siteName);
        });
    });

    it('should display various deployment statuses', () => {
        useDeploymentsViewWidget({
            routeHandler: {
                fixture: 'deployments/various-statuses.json'
            }
        });

        cy.log('Show all columns');
        cy.editWidgetConfiguration(widgetId, () => {
            widgetConfiguration.toggleFieldsDropdown();
            widgetConfiguration.getFieldsDropdown().within(() => {
                cy.get('[role="option"]').contains('Environment Type').click();
            });
            widgetConfiguration.toggleFieldsDropdown();
        });

        getDeploymentsViewTable().within(() => {
            cy.contains('deployments_view_test_deployment')
                .parents('tr')
                .find('i.exclamation[aria-label="Requires attention"]')
                .as('requiresAttentionIcon')
                .trigger('mouseover');
            cy.root().parents('body').find('.popup').contains('Requires attention');
            cy.get('@requiresAttentionIcon').trigger('mouseout');

            cy.contains('hello-world-one')
                .parents('tr')
                .find('i.spinner[aria-label="In progress"]')
                .as('inProgressIcon')
                .trigger('mouseover');
            cy.root().parents('body').find('.popup').contains('In progress');
            cy.get('@inProgressIcon').trigger('mouseout');

            cy.contains('one-in-warsaw').parents('tr').find('td:nth-child(1) i').should('not.exist');
        });

        getDeploymentsViewTable().within(() => {
            cy.contains('deployments_view_test_deployment')
                .parents('tr')
                .within(() => {
                    cy.contains('controller');
                });
            cy.contains('one-in-warsaw')
                .parents('tr')
                .within(() => {
                    cy.contains('subcloud');
                });
            cy.contains('hello-world-one')
                .parents('tr')
                .within(() => {
                    cy.contains('acidic');
                });
        });
    });
});
