import type { RouteHandler } from 'cypress/types/net-stubbing';
import { without } from 'lodash';

import type { SystemLabel } from '../../support/deployments';

import { exampleBlueprintUrl } from '../../support/resource_urls';
import { FilterRuleOperators, FilterRuleType } from '../../../../widgets/common/src/filters/types';

describe('Deployments View widget', () => {
    const widgetId = 'deploymentsView';
    const specPrefix = 'deployments_view_test_';
    const blueprintName = `${specPrefix}blueprint`;
    const deploymentName = `${specPrefix}deployment`;
    const deploymentNameThatMatchesFilter = `${specPrefix}precious_deployment`;
    const siteName = 'Olsztyn';
    const blueprintUrl = exampleBlueprintUrl;
    const widgetConfiguration: import('../../../../widgets/deploymentsView/src/widget').DeploymentsViewWidgetConfiguration = {
        filterByParentDeployment: false,
        fieldsToShow: ['status', 'name', 'blueprintName', 'location', 'subenvironmentsCount', 'subservicesCount'],
        pageSize: 100,
        customPollingTime: 10,
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
        'deploymentActionButtons',
        'deploymentsViewDrilledDown'
    ];
    /** Column numbers as they appear in the table */
    const columnNumbers = {
        status: 1,
        environmentType: 4,
        subenvironments: 6,
        subservices: 7
    };

    before(() => {
        cy.activate()
            .deleteDeployments(specPrefix, true)
            .deleteSites(siteName)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite({ name: siteName })
            .setSite(deploymentName, siteName)
            .setLabels(deploymentName, [{ 'rendered-inside': 'details-panel' }]);
    });

    beforeEach(() => {
        // NOTE: larger viewport since the widget requires more width to be comfortable to use
        cy.viewport(1600, 900);
    });

    const useDeploymentsViewWidget = ({
        routeHandler,
        configurationOverrides = {}
    }: { routeHandler?: RouteHandler; configurationOverrides?: Record<string, any> } = {}) => {
        cy.interceptSp('POST', /^\/searches\/deployments/, routeHandler).as('deployments');
        cy.usePageMock(
            [widgetId],
            { ...widgetConfiguration, ...configurationOverrides },
            { additionalWidgetIdsToLoad, widgetsWidth: 12, additionalPageTemplates: ['drilldownDeployments'] }
        ).mockLogin();
        cy.wait('@deployments');
    };

    const getDeploymentsViewWidget = () =>
        cy.get('.widget').filter('.deploymentsViewWidget, .deploymentsViewDrilledDownWidget').find('.widgetItem');
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

        cy.log('Check for maximization buttons');
        // NOTE: there should be only the maximization button for the main widget.
        // Widgets in the details pane should not have them, since they would be noops.
        getDeploymentsViewWidget().find('i.expand').should('have.length', 1);

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

            cy.log('Deployments should be refetched after executing a workflow');
            cy.wait('@deployments');
        });
    });

    describe('with filters', () => {
        const filterId = 'only-precious';
        before(() => {
            cy.deleteDeploymentsFilter(filterId, { ignoreFailure: true })
                .createDeploymentsFilter(filterId, [
                    {
                        type: FilterRuleType.Label,
                        key: 'precious',
                        values: ['yes'],
                        operator: FilterRuleOperators.AnyOf
                    }
                ])
                .deployBlueprint(blueprintName, deploymentNameThatMatchesFilter, { webserver_port: 9124 })
                .setLabels(deploymentNameThatMatchesFilter, [{ precious: 'yes' }]);
        });

        const getFilterIdInput = () =>
            cy.contains('Name of the saved filter to apply').parent().get('input[type="text"]');

        it('should take the filter into account when displaying deployments', () => {
            useDeploymentsViewWidget({ configurationOverrides: { filterId } });

            cy.log('Show only precious deployments');
            cy.contains(deploymentNameThatMatchesFilter);
            cy.contains(deploymentName).should('not.exist');

            cy.log('Show all deployments');
            cy.editWidgetConfiguration(widgetId, () => {
                getFilterIdInput().clear();
            });

            cy.contains(deploymentNameThatMatchesFilter);
            cy.contains(deploymentName);

            cy.log('Invalid filter id');
            cy.editWidgetConfiguration(widgetId, () => {
                getFilterIdInput().type('some-very-gibberish-filter-id');
            });

            cy.contains(/with ID .* was not found/);
        });
    });

    it('should display various deployment information', () => {
        useDeploymentsViewWidget({
            routeHandler: {
                fixture: 'deployments/various-statuses.json'
            },
            configurationOverrides: {
                fieldsToShow: [...widgetConfiguration.fieldsToShow, 'environmentType']
            }
        });

        const verifyEnvironmentType = (environmentType: string) => {
            cy.get(`td:nth-of-type(${columnNumbers.environmentType})`).contains(environmentType);
        };
        const verifySubdeployments = ({
            columnNumber,
            count,
            iconLabel
        }: {
            columnNumber: number;
            count: number;
            iconLabel?: string;
        }) => {
            cy.log(`Verify subdeployments in column ${columnNumber}`);
            cy.get(`td:nth-of-type(${columnNumber})`).within(() => {
                cy.contains(count);

                if (iconLabel) {
                    cy.get(`i[aria-label="${iconLabel}"]`);
                } else {
                    cy.get('i').should('not.exist');
                }
            });
        };
        const verifyProgressBar = (className: string, width: string) => {
            cy.root()
                .next('tr.deployment-progress-row')
                .find('.deployment-progress-bar')
                .should('have.class', className)
                // NOTE: cannot use have.css since it returns the computed width in px, not the percentage
                // See https://github.com/cypress-io/cypress/issues/6309#issuecomment-656554907
                .should('have.attr', 'style')
                .and('include', `width: ${width}`);
        };

        getDeploymentsViewTable().within(() => {
            cy.contains('deployments_view_test_deployment')
                .parents('tr')
                .within(() => {
                    cy.get(`td:nth-of-type(${columnNumbers.status}) i.exclamation[aria-label="Requires attention"]`)
                        .as('requiresAttentionIcon')
                        .trigger('mouseover');
                    cy.root().parents('body').find('.popup').contains('Requires attention');
                    cy.get('@requiresAttentionIcon').trigger('mouseout');

                    verifyEnvironmentType('controller');
                    verifySubdeployments({
                        columnNumber: columnNumbers.subenvironments,
                        count: 1,
                        iconLabel: 'In progress'
                    });
                    verifySubdeployments({
                        columnNumber: columnNumbers.subservices,
                        count: 3,
                        iconLabel: 'Requires attention'
                    });
                    verifyProgressBar('failed', '60%');
                });

            cy.contains('hello-world-one')
                .parents('tr')
                .within(() => {
                    cy.get(`td:nth-of-type(${columnNumbers.status}) i.spinner[aria-label="In progress"]`)
                        .as('inProgressIcon')
                        .trigger('mouseover');
                    cy.root().parents('body').find('.popup').contains('In progress');
                    cy.get('@inProgressIcon').trigger('mouseout');

                    verifyEnvironmentType('acidic');
                    verifySubdeployments({
                        columnNumber: columnNumbers.subenvironments,
                        count: 5
                    });
                    verifySubdeployments({
                        columnNumber: columnNumbers.subservices,
                        count: 80,
                        iconLabel: 'In progress'
                    });
                    verifyProgressBar('in-progress', '30%');
                });

            cy.contains('one-in-warsaw')
                .parents('tr')
                .within(() => {
                    cy.get('td:nth-child(1) i').should('not.exist');

                    verifyEnvironmentType('subcloud');
                    verifySubdeployments({
                        columnNumber: columnNumbers.subenvironments,
                        count: 10
                    });
                    verifySubdeployments({
                        columnNumber: columnNumbers.subservices,
                        count: 8
                    });

                    // NOTE: ensure no progress bar
                    cy.root()
                        .should('have.class', 'deployment-progressless-row')
                        .next('tr')
                        .should('not.have.class', 'deployment-progress-row');
                });
        });
    });

    describe('drill-down functionality', () => {
        // Graph of deployments used in the tests
        // Generated using https://textik.com/
        //
        // All names are prefixed with `specPrefix`
        //
        //                app-env
        //                  - -
        //                -/   \-
        //               /       \-
        //             -/          \-
        //            /              \
        //         db-env           web-app
        //          ---
        //        -/   \-
        //      -/       \
        //   db-1        db-2

        type DrilldownDeploymentName = 'app-env' | 'db-env' | 'db-1' | 'db-2' | 'web-app';
        const getDeploymentFullName = (name: DrilldownDeploymentName) => `${specPrefix}_${name}`;
        // NOTE: the order matters, because the deployments will be created in this order
        const deployments: Record<DrilldownDeploymentName, SystemLabel[]> = {
            'app-env': [{ 'csys-obj-type': 'environment' }],
            'db-env': [{ 'csys-obj-type': 'environment' }, { 'csys-obj-parent': getDeploymentFullName('app-env') }],
            'db-1': [{ 'csys-obj-type': 'service' }, { 'csys-obj-parent': getDeploymentFullName('db-env') }],
            'db-2': [{ 'csys-obj-type': 'service' }, { 'csys-obj-parent': getDeploymentFullName('db-env') }],
            'web-app': [{ 'csys-obj-type': 'service' }, { 'csys-obj-parent': getDeploymentFullName('app-env') }]
        };

        before(() => {
            cy.log('Creating multiple deployments for the drill-down tests');
            Object.entries(deployments).forEach(([deploymentShortName, labels], index) => {
                const deploymentFullName = getDeploymentFullName(deploymentShortName as keyof typeof deployments);
                cy.deployBlueprint(blueprintName, deploymentFullName, { webserver_port: 9122 - index }).setLabels(
                    deploymentFullName,
                    labels
                );
            });
        });

        const useEnvironmentsWidget = () => {
            useDeploymentsViewWidget({
                configurationOverrides: {
                    filterId: 'csys-environment-filter'
                }
            });
        };
        const getSubenvironmentsButton = () => cy.get('button').contains('Subenvironments');
        const getSubservicesButton = () => cy.get('button').contains('Services');
        const getBreadcrumbs = () => cy.get('.breadcrumb');

        it('should support the drill-down workflow', () => {
            useEnvironmentsWidget();

            getDeploymentsViewTable().within(() => {
                cy.log('Only top-level environments should be visible');
                cy.contains('app-env');
                cy.contains('db-env').should('not.exist');
                cy.contains('db-1').should('not.exist');
                cy.contains('db-2').should('not.exist');
                cy.contains('web-app').should('not.exist');
            });

            getDeploymentsViewDetailsPane().within(() => {
                getSubservicesButton().contains('1');
                cy.log('Drill down to subenvironments of app-env');
                getSubenvironmentsButton().contains('1').click();
            });

            getBreadcrumbs().contains('app-env [Environments]');

            const verifySubdeploymentsOfAppEnv = () => {
                getDeploymentsViewTable().within(() => {
                    cy.log('Subenvironments of app-env should be visible (only db-env)');
                    cy.contains('db-env');
                    cy.contains('app-env').should('not.exist');
                    cy.contains('db-1').should('not.exist');
                    cy.contains('web-app').should('not.exist');
                });
            };
            verifySubdeploymentsOfAppEnv();

            getDeploymentsViewDetailsPane().within(() => {
                getSubenvironmentsButton().contains('0').should('be.disabled');
                cy.log('Drill down to subservices of db-env');
                getSubservicesButton().contains('2').click();
            });

            getBreadcrumbs().contains('db-env [Services]');
            getBreadcrumbs().contains('app-env [Environments]');
            getDeploymentsViewTable().within(() => {
                cy.log('Subservices of db-env should be visible (db-1, db-2)');
                cy.contains('db-1').click();
                cy.contains('db-2');
                cy.contains('db-env').should('not.exist');
            });

            getDeploymentsViewDetailsPane().within(() => {
                getSubenvironmentsButton().contains('0').should('be.disabled');
                getSubservicesButton().contains('0').should('be.disabled');
            });

            cy.log('Go back to the parent environment');
            getBreadcrumbs().contains('app-env').click();
            verifySubdeploymentsOfAppEnv();

            cy.log('Go back to top-level page');
            getBreadcrumbs().contains('Test Page').click();
            getDeploymentsViewDetailsPane().within(() => {
                cy.log('Drill down to subservices of app-env');
                getSubservicesButton().contains('1').click();
            });
            getDeploymentsViewTable().within(() => {
                cy.log('Subservices of app-end should be visible (web-app)');
                cy.contains('web-app');
                cy.contains('db-env').should('not.exist');
            });
        });

        it('should allow deleting a deployment without redirecting to the parent page', () => {
            const tempDeploymentId = `${specPrefix}_temp_deployment_to_remove`;
            const parentDeploymentId = getDeploymentFullName('app-env');
            cy.deployBlueprint(blueprintName, tempDeploymentId).setLabels(tempDeploymentId, [
                { 'csys-obj-type': 'service' },
                { 'csys-obj-parent': parentDeploymentId }
            ]);

            useEnvironmentsWidget();

            getDeploymentsViewDetailsPane().within(() => getSubservicesButton().click());

            getBreadcrumbs().contains(parentDeploymentId);

            getDeploymentsViewTable().within(() => cy.contains(tempDeploymentId).click());

            cy.log('Delete the deployment');
            getDeploymentsViewDetailsPane().contains('Deployment actions').click();
            cy.get('.popup').contains('Delete').click();
            cy.get('.modal').contains('Yes').click();

            getDeploymentsViewTable().within(() => cy.contains(tempDeploymentId).should('not.exist'));
            getBreadcrumbs().contains(parentDeploymentId);
        });
    });

    it('should display an error message when using the drilled-down widget on a top-level page', () => {
        cy.usePageMock([`${widgetId}DrilledDown`]).mockLogin();

        cy.contains('Unexpected widget usage');
    });
});
