import type { RouteHandler } from 'cypress/types/net-stubbing';
import { without } from 'lodash';

import type { SystemLabel } from '../../support/deployments';

import { exampleBlueprintUrl } from '../../support/resource_urls';
import { FilterRuleOperators, FilterRuleType } from '../../../../widgets/common/src/filters/types';
import type {} from '../../../../widgets/common/src/deploymentsView';

describe('Deployments View widget', () => {
    const widgetId = 'deploymentsView';
    const specPrefix = 'deployments_view_test_';
    const blueprintName = `${specPrefix}blueprint`;
    const deploymentName = `${specPrefix}deployment`;
    const exampleSiteName = 'Olsztyn';
    const blueprintUrl = exampleBlueprintUrl;
    const widgetConfiguration: import('../../../../widgets/deploymentsView/src/widget').DeploymentsViewWidgetConfiguration = {
        filterByParentDeployment: false,
        fieldsToShow: ['status', 'name', 'blueprintName', 'location', 'subenvironmentsCount', 'subservicesCount'],
        pageSize: 100,
        customPollingTime: 10,
        sortColumn: 'created_at',
        sortAscending: false,
        mapHeight: 300,
        mapOpenByDefault: false
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
            .deleteSites(exampleSiteName)
            .deleteBlueprint(blueprintName, true)
            .uploadBlueprint(blueprintUrl, blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { webserver_port: 9123 })
            .createSite({ name: exampleSiteName, location: '53.77509462534224, 20.473709106445316' })
            .setSite(deploymentName, exampleSiteName)
            .setLabels(deploymentName, [{ 'rendered-inside': 'details-panel' }]);
    });

    beforeEach(() => {
        // NOTE: larger viewport since the widget requires more width to be comfortable to use
        cy.viewport(1600, 900);
    });

    const useDeploymentsViewWidget = ({
        routeHandler,
        configurationOverrides = {}
    }: { routeHandler?: RouteHandler; configurationOverrides?: Partial<typeof widgetConfiguration> } = {}) => {
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
    const getDeploymentsViewMap = () => getDeploymentsViewWidget().find('.leaflet-container');
    const getDeploymentsMapToggleButton = () => getDeploymentsViewWidget().contains('button', 'Map');

    const verifyMapHeight = (expectedHeight: number) =>
        getDeploymentsViewMap().invoke('height').should('eq', expectedHeight);

    const widgetConfigurationHelpers = {
        getFieldsDropdown: () => cy.contains('List of fields to show in the table').parent().find('[role="listbox"]'),
        toggleFieldsDropdown: () => widgetConfigurationHelpers.getFieldsDropdown().find('.dropdown.icon').click(),
        mapHeightInput: () => cy.contains('Map height').parent().find('input[type="number"]')
    };

    const widgetHeader = {
        setFilter: (filterId: string) => {
            cy.contains('button', 'Filter').click();

            cy.get('.modal').within(() => {
                cy.get('input').type(`${filterId}{enter}`);
                cy.contains('OK').click();
            });

            cy.get('.modal').should('not.exist');
            cy.contains('button', 'Filter').should('not.exist');
            cy.contains('button', filterId);
        },
        openRunWorkflowModal: () => {
            cy.contains('Bulk Actions').click();
            cy.contains('Run Workflow').click();
        },
        openDeployOnModal: () => {
            cy.contains('Bulk Actions').click();
            cy.contains('Deploy On').click();
        }
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
                cy.contains(exampleSiteName).should('not.exist');
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
                cy.contains(exampleSiteName).should('not.exist');
            });
        });

        it('should affect the map', () => {
            useDeploymentsViewWidget({
                configurationOverrides: { mapOpenByDefault: true }
            });

            verifyMapHeight(widgetConfiguration.mapHeight);

            const newHeight = 100;

            cy.editWidgetConfiguration(widgetId, () => {
                // NOTE: after clearing the input, 0 is automatically inserted. {home}{del} removes the leading 0
                widgetConfigurationHelpers.mapHeightInput().clear().type(`${newHeight}{home}{del}`);
            });

            verifyMapHeight(newHeight);
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
                    cy.contains(exampleSiteName);
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

    it('should select the first visible deployment by default', () => {
        useDeploymentsViewWidget();

        getDeploymentsViewTable().find('tbody tr:first-of-type.active').should('exist');
    });

    describe('with filters', () => {
        const deploymentNameThatMatchesFilter = `${specPrefix}precious_deployment`;
        const filterId = 'only-precious';
        const filterRules: Stage.Common.Filters.Rule[] = [
            {
                type: FilterRuleType.Label,
                key: 'precious',
                values: ['yes'],
                operator: FilterRuleOperators.AnyOf
            }
        ];

        before(() => {
            cy.deleteDeploymentsFilter(filterId, { ignoreFailure: true })
                .createDeploymentsFilter(filterId, filterRules)
                .deployBlueprint(blueprintName, deploymentNameThatMatchesFilter, { webserver_port: 9124 })
                .setLabels(deploymentNameThatMatchesFilter, [{ precious: 'yes' }]);
        });

        it('should take the configured filter into account when displaying deployments', () => {
            const getFilterIdInput = () =>
                cy.contains('Name of the saved filter to apply').parent().get('input[type="text"]');

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

        it('should take the selected filter into account when displaying deployments', () => {
            useDeploymentsViewWidget();

            cy.contains(deploymentNameThatMatchesFilter);
            cy.contains(deploymentName);
            cy.interceptSp('POST', '/searches/deployments').as('deploymentsSearchRequest');

            widgetHeader.setFilter(filterId);

            cy.wait('@deploymentsSearchRequest').then(({ request }) => {
                const requestRules = request.body.filter_rules;
                expect(requestRules).to.deep.equal(filterRules);
            });

            cy.contains(deploymentName).should('not.exist');
            cy.contains(deploymentNameThatMatchesFilter);

            cy.get('[title="Clear selected filter"]').click().should('not.exist');
            cy.contains('button', 'Filter');
            cy.contains('button', filterId).should('not.exist');

            cy.contains(deploymentName);
            cy.contains(deploymentNameThatMatchesFilter);
        });

        // NOTE: this test does not really belong to the filters functionality, but it needs at least two deployments to work
        it('should allow selecting a deployment through the Resource Filter widget', () => {
            useDeploymentsViewWidget();

            const getSelectedDeployment = () => getDeploymentsViewTable().find('tbody tr.active');

            cy.setDeploymentContext(deploymentName);
            getSelectedDeployment().contains(deploymentName);
            cy.setDeploymentContext(deploymentNameThatMatchesFilter);
            getSelectedDeployment().contains(deploymentNameThatMatchesFilter);
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
            'db-1': [{ 'csys-obj-parent': getDeploymentFullName('db-env') }],
            'db-2': [{ 'csys-obj-parent': getDeploymentFullName('db-env') }],
            'web-app': [{ 'csys-obj-parent': getDeploymentFullName('app-env') }]
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
        const getSubenvironmentsButton = () => cy.contains('button', 'Subenvironments');
        const getSubservicesButton = () => cy.contains('button', 'Services');
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
                getSubservicesButton().within(() => {
                    cy.containsNumber(1);
                    cy.get('i[aria-label="Requires attention"]').should('exist');
                });
                cy.log('Drill down to subenvironments of app-env');
                getSubenvironmentsButton()
                    .within(() => {
                        cy.containsNumber(1);
                        cy.get('i[aria-label="Requires attention"]').should('exist');
                    })
                    .click();
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
                getSubenvironmentsButton().containsNumber(0).should('be.disabled');
                cy.log('Drill down to subservices of db-env');
                getSubservicesButton().containsNumber(2).click();
            });

            getBreadcrumbs().contains('db-env [Services]');
            getBreadcrumbs().contains('app-env [Environments]');
            getDeploymentsViewTable().within(() => {
                cy.log('Subservices of db-env should be visible (db-1, db-2)');
                cy.contains('db-1').click();
                cy.contains('db-2');
                cy.contains('db-env').should('not.exist');
            });

            const expectOnlySubdeploymentTypeIcon = () => {
                cy.get('i').should('have.length', 1).not('.object.group.icon, .cube.icon').should('have.length', 0);
            };

            getDeploymentsViewDetailsPane().within(() => {
                getSubenvironmentsButton()
                    .should('be.disabled')
                    .within(() => {
                        cy.containsNumber(0);
                        expectOnlySubdeploymentTypeIcon();
                    });
                getSubservicesButton()
                    .should('be.disabled')
                    .within(() => {
                        cy.containsNumber(0);
                        expectOnlySubdeploymentTypeIcon();
                    });
            });

            cy.log('Go back to the parent environment');
            getBreadcrumbs().contains('app-env').click();
            verifySubdeploymentsOfAppEnv();

            cy.log('Go back to top-level page');
            getBreadcrumbs().contains('Test Page').click();
            getDeploymentsViewDetailsPane().within(() => {
                cy.log('Drill down to subservices of app-env');
                getSubservicesButton().containsNumber(1).click();
            });
            getDeploymentsViewTable().within(() => {
                cy.log('Subservices of app-env should be visible (web-app)');
                cy.contains('web-app');
                cy.contains('db-env').should('not.exist');
            });
        });

        it('should keep the map open when drilling down and going back up', () => {
            useEnvironmentsWidget();

            getDeploymentsMapToggleButton().click();
            getDeploymentsViewMap().should('exist');

            cy.log('Drill down to the environments of app-env');
            getDeploymentsViewTable().contains('app-env').click();
            getDeploymentsViewDetailsPane().within(() => {
                getSubenvironmentsButton().click();
            });
            getBreadcrumbs().contains('app-env [Environments]');
            getDeploymentsViewMap().should('exist');

            cy.log('Go back to the parent environment');
            getBreadcrumbs().contains('Test Page').click();
            getDeploymentsViewTable().contains('app-env').click();
            getDeploymentsViewMap().should('exist');
        });

        it('should allow deleting a deployment without redirecting to the parent page', () => {
            const tempDeploymentId = `${specPrefix}_temp_deployment_to_remove`;
            const parentDeploymentId = getDeploymentFullName('app-env');
            cy.deployBlueprint(blueprintName, tempDeploymentId).setLabels(tempDeploymentId, [
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

        it('should refresh the drill-down buttons on an interval', () => {
            useDeploymentsViewWidget({ configurationOverrides: { customPollingTime: 1 } });

            cy.getSearchInput().type(deploymentName);

            getDeploymentsViewDetailsPane().within(() => {
                getSubservicesButton().containsNumber(0);

                cy.interceptSp('GET', `${deploymentName}?all_sub_deployments=false`, req =>
                    req.reply(res => {
                        res.body.sub_services_count = 50;
                    })
                ).as('deploymentDetails');
                cy.wait('@deploymentDetails');

                getSubservicesButton().containsNumber(50);
            });
        });
    });

    it('should display an error message when using the drilled-down widget on a top-level page', () => {
        cy.usePageMock([`${widgetId}DrilledDown`]).mockLogin();

        cy.contains('Unexpected widget usage');
    });

    describe('map', () => {
        const siteNames = {
            olsztyn: exampleSiteName,
            telAviv: 'Tel-Aviv',
            london: 'London',
            warsaw: 'Warsaw'
        } as const;
        const mapDeploymentsPrefix = `${deploymentName}_map`;
        const getSiteDeploymentName = (siteName: Stage.Types.ObjectKeys<typeof siteNames>) =>
            `${mapDeploymentsPrefix}_${siteName}`;

        before(() => {
            Object.values(siteNames)
                // NOTE: the exampleSiteName is used in other tests, so it cannot be removed here
                .filter(siteName => siteName !== exampleSiteName)
                .forEach(siteName => {
                    cy.deleteSite(siteName, { ignoreFailure: true });
                });

            cy.createSites([
                {
                    name: siteNames.telAviv,
                    location: '32.066667,34.783333'
                },
                {
                    name: siteNames.london,
                    location: '51.509865,-0.118092'
                },
                {
                    name: siteNames.warsaw,
                    location: '52.229676,21.012229'
                }
            ]);

            [siteNames.olsztyn, siteNames.london, siteNames.warsaw].forEach(siteName => {
                const currentDeploymentId = getSiteDeploymentName(siteName);
                cy.deployBlueprint(blueprintName, currentDeploymentId).setSite(currentDeploymentId, siteName);
            });
        });

        const getDeploymentsMapTooltip = () => cy.get('.leaflet-tooltip');
        enum MarkerImageSuffix {
            Red = 'red.png',
            Yellow = 'yellow.png',
            Blue = 'blue.png'
        }
        const getMarkerByImageSuffix = (markerImageSuffix: MarkerImageSuffix) =>
            cy.get(`.leaflet-marker-pane img[src$="${markerImageSuffix}"]`);
        const withinMarkerTooltip = (
            getMarker: () => Cypress.Chainable,
            callback: (currentSubject: JQuery<HTMLElement>) => void,
            { ignoreMarkerNotInView = false }: { ignoreMarkerNotInView?: boolean } = {}
        ) => {
            getMarker().trigger('mouseover', { force: ignoreMarkerNotInView });
            getDeploymentsMapTooltip().within(callback);
            getMarker().trigger('mouseout', { force: ignoreMarkerNotInView });
        };
        function selectDeploymentInTableAndVerifyMapSelection(name: string) {
            const getSelectedMarker = () => cy.get('path.test__map-selected-marker');

            getDeploymentsViewTable().contains(name).click();
            getDeploymentsViewMap().within(() => {
                // NOTE: need to `force` events, since the selection circle is covered by a marker image
                // and Cypress would not interact with the circle underneath
                withinMarkerTooltip(getSelectedMarker, () => cy.contains(name), { ignoreMarkerNotInView: true });
            });
        }
        const getDeploymentMarkerIcons = () => cy.get('.leaflet-marker-icon');

        it('should be toggled upon clicking the button', () => {
            useDeploymentsViewWidget();

            getDeploymentsViewMap().should('not.exist');

            getDeploymentsMapToggleButton()
                .click()
                .should('have.class', 'active')
                .should('have.attr', 'title', 'Close map');
            cy.getSearchInput().type(siteNames.london);
            getDeploymentsViewMap().within(() => {
                getDeploymentMarkerIcons().should('have.length', 1);
                withinMarkerTooltip(
                    () => getMarkerByImageSuffix(MarkerImageSuffix.Red),
                    () => cy.contains(getSiteDeploymentName(siteNames.london))
                );
            });

            getDeploymentsMapToggleButton()
                .click()
                .should('not.have.class', 'active')
                .should('have.attr', 'title', 'Open map');
            getDeploymentsViewMap().should('not.exist');
        });

        it('should render markers for various deployment states', () => {
            useDeploymentsViewWidget({
                routeHandler: {
                    fixture: 'deployments/various-statuses.json'
                },
                configurationOverrides: {
                    mapOpenByDefault: true
                }
            });

            getDeploymentsViewMap().within(() => {
                getDeploymentMarkerIcons().should('be.visible').and('have.length', 3);

                const getTooltipSubenvironments = () => cy.get('i.icon.object.group').parent();
                const getTooltipSubservices = () => cy.get('i.icon.cube').parent();
                withinMarkerTooltip(
                    () => getMarkerByImageSuffix(MarkerImageSuffix.Yellow),
                    () => {
                        cy.contains('hello-world-one');
                        cy.contains('Cloudify-Hello-World');
                        cy.contains(siteNames.london);
                        cy.contains('In progress').parent().find('i.orange.spinner');
                        getTooltipSubenvironments().containsNumber(5);
                        getTooltipSubservices().within(() => {
                            cy.containsNumber(80);
                            cy.get('[aria-label="In progress"]');
                        });
                    }
                );

                withinMarkerTooltip(
                    () => getMarkerByImageSuffix(MarkerImageSuffix.Red),
                    () => {
                        cy.contains('deployments_view_test_deployment');
                        cy.contains(blueprintName);
                        cy.contains(siteNames.olsztyn);
                        cy.contains('Requires attention').parent().find('i.red.exclamation');
                        getTooltipSubenvironments().within(() => {
                            cy.containsNumber(1);
                            cy.get('[aria-label="In progress"]');
                        });
                        getTooltipSubservices().within(() => {
                            cy.containsNumber(3);
                            cy.get('[aria-label="Requires attention"]');
                        });
                    }
                );

                withinMarkerTooltip(
                    () => getMarkerByImageSuffix(MarkerImageSuffix.Blue),
                    () => {
                        cy.contains('one-in-warsaw');
                        cy.contains('Cloudify-Hello-World');
                        cy.contains(siteNames.warsaw);
                        cy.contains('Good');
                        getTooltipSubenvironments().containsNumber(10);
                        getTooltipSubservices().containsNumber(8);
                    }
                );
            });
        });

        it('should highlight the selected deployment', () => {
            useDeploymentsViewWidget({
                configurationOverrides: { mapOpenByDefault: true }
            });

            cy.getSearchInput().type(mapDeploymentsPrefix);

            selectDeploymentInTableAndVerifyMapSelection(getSiteDeploymentName(siteNames.london));

            /**
             * NOTE: there is no information in the DOM about which deployment a given marker is for.
             * Thus, the test goes through all markers and inspects the tooltips that are shown
             * for those markers.
             */
            cy.log('Click markers on the map and verify selection in the table');
            cy.get('.leaflet-marker-pane img')
                .as('markers')
                .should('have.length', 3)
                .each((_, index) => {
                    // NOTE: need to query the DOM for markers again to get
                    // latest elements, since the DOM structure changes during
                    // the test and previous elements are removed from the DOM.
                    cy.get('@markers')
                        .then(markers => markers[index])
                        .then(marker => {
                            /*
                             * NOTE: the variable is set asynchronously. Be careful when using the variable
                             * in the current scope. Try to use it in some nested scope, e.g. by using `within`
                             */
                            let currentDeploymentName = '';
                            withinMarkerTooltip(
                                () => cy.wrap(marker),
                                element => {
                                    currentDeploymentName = element.find('h4').text();
                                }
                            );
                            cy.wrap(marker).click();
                            getDeploymentsViewTable().within(() => {
                                cy.get('tr.active').contains(currentDeploymentName);
                            });
                        });
                });
        });

        it('should cluster markers and always show the selected deployment marker outside the cluster', () => {
            useDeploymentsViewWidget({
                configurationOverrides: { mapOpenByDefault: true }
            });

            const zoomOut = () => cy.get('[aria-label="Zoom out"]').click();
            cy.getSearchInput().type(mapDeploymentsPrefix);

            selectDeploymentInTableAndVerifyMapSelection(getSiteDeploymentName(siteNames.london));
            cy.log('Check if there is a cluster');
            getDeploymentsViewMap().within(() => {
                zoomOut();
                getDeploymentMarkerIcons().should('have.length', 2);
                cy.contains('.leaflet-marker-icon', 2).click();
                cy.log('Check that the cluster is zoomed-in into');
                getDeploymentMarkerIcons().should('have.length', 3);
                zoomOut();
                getDeploymentMarkerIcons().should('have.length', 2);
            });

            selectDeploymentInTableAndVerifyMapSelection(getSiteDeploymentName(siteNames.warsaw));
            cy.log('Check that the selected deployment is not clustered');
            getDeploymentsViewMap().within(() => {
                getDeploymentMarkerIcons().should('have.length', 3);
            });
        });
    });

    describe('bulk actions', () => {
        const siteName = 'Krakow';
        const siteFilterName = `in-${siteName}`;
        const deploymentIds = Array.from({ length: 2 }).map((_, i) => `${specPrefix}_${siteName}_deployment_${i + 1}`);

        before(() => {
            cy.deleteSite(siteName, { ignoreFailure: true })
                .createSite({ name: siteName })
                .deleteDeploymentsFilter(siteFilterName, { ignoreFailure: true })
                .createDeploymentsFilter(siteFilterName, [
                    {
                        type: FilterRuleType.Attribute,
                        key: 'site_name',
                        operator: FilterRuleOperators.AnyOf,
                        values: [siteName]
                    }
                ]);
            deploymentIds.forEach(deploymentId =>
                cy
                    .deployBlueprint(blueprintName, deploymentId, { webserver_port: 9124 })
                    .setSite(deploymentId, siteName)
            );
        });

        beforeEach(() => {
            cy.interceptSp('PUT', '/deployment-groups/BATCH_ACTION_').as('createDeploymentGroup');
            cy.interceptSp('POST', '/execution-groups').as('startExecutionGroup');
        });

        it('should allow to run workflow on filtered deployments', () => {
            cy.interceptSp('POST', '/searches/workflows').as('searchWorkflows');

            useDeploymentsViewWidget({ configurationOverrides: { filterId: siteFilterName } });
            widgetHeader.openRunWorkflowModal();

            cy.get('.modal').within(() => {
                cy.wait('@searchWorkflows');

                cy.setSearchableDropdownValue('Workflow', 'restart');
                cy.contains('button', 'Run').click();

                cy.wait('@createDeploymentGroup')
                    .its('response.body.deployment_ids')
                    .should('include.members', deploymentIds);
                cy.wait('@startExecutionGroup').its('response.body.workflow_id').should('be.equal', 'restart');
            });

            cy.contains('.modal', 'Group execution started').within(() => {
                cy.contains('Go to Executions page');
                cy.contains('Close').click();
            });
        });

        it('should allow to create child deployments on filtered deployments', () => {
            cy.interceptSp('POST', '/searches/deployments').as('searchDeployments');

            useDeploymentsViewWidget({ configurationOverrides: { filterId: siteFilterName } });
            widgetHeader.openDeployOnModal();

            const labelKey = 'label_key';
            const labelValue = 'label_value';
            cy.get('.modal').within(() => {
                cy.setSearchableDropdownValue('Blueprint', blueprintName);

                cy.contains('.field', 'Labels').find('.selection').click();
                cy.get('div[name=labelKey] > input').type(labelKey);
                cy.get('div[name=labelValue] > input').type(labelValue);
                cy.get('[aria-label=Add]').click();
                cy.get('a.label').should('be.visible');

                cy.contains('Deploy & Install').click();
            });

            cy.contains('.modal button', 'Execute').click();

            cy.wait('@searchDeployments');
            cy.wait('@createDeploymentGroup').then(({ request }) => {
                expect(request.body.blueprint_id).to.eq(blueprintName);
                expect(request.body.labels).to.deep.equal([{ [labelKey]: labelValue }]);
                expect(request.body.new_deployments).to.deep.equal(
                    deploymentIds.map(deploymentId => ({
                        id: '{uuid}',
                        display_name: '{blueprint_id}-{uuid}',
                        labels: [{ 'csys-obj-parent': deploymentId }],
                        runtime_only_evaluation: false,
                        skip_plugins_validation: false
                    }))
                );
            });
            cy.wait('@startExecutionGroup').its('response.body.workflow_id').should('be.equal', 'install');

            cy.contains('.modal', 'Group execution started').within(() => {
                cy.contains('Go to Executions page');
                cy.contains('Close').click();
            });
        });
    });
});
