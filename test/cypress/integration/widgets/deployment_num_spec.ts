describe('Number of Deployments widget', () => {
    const widgetId = 'deploymentNum';
    const resourcePrefix = `${widgetId}_test_`;
    const testBlueprintId = `${resourcePrefix}bp`;
    const serviceDeploymentId1 = `${resourcePrefix}service_1`;
    const serviceDeploymentId2 = `${resourcePrefix}service_2`;
    const environmentDeploymentId = `${resourcePrefix}environment`;
    const testDeploymentIds = [serviceDeploymentId1, serviceDeploymentId2, environmentDeploymentId];

    before(() => {
        cy.activate();
        cy.interceptSp('GET', /\/deployments*/).as('fetchDeployments');
        cy.usePageMock(widgetId).mockLogin();
    });

    beforeEach(() => cy.visitPage('Test Page'));

    describe('should display correct number of deployments', () => {
        before(() => {
            cy.killRunningExecutions()
                .deleteDeployments('', true)
                .deleteBlueprints(resourcePrefix, true)
                .uploadBlueprint('blueprints/empty.zip', testBlueprintId);
            testDeploymentIds.forEach(deploymentId => cy.deployBlueprint(testBlueprintId, deploymentId));
            cy.setLabels(environmentDeploymentId, [{ 'csys-obj-type': 'environment' }]);
        });

        function setFilterId(filterId: string) {
            cy.editWidgetConfiguration(widgetId, () => cy.setSearchableDropdownValue('Filter ID', filterId));
        }

        function deploymentCountShouldBeEqualTo(expectedDeploymentsCount: number) {
            return cy.get('.statistic .value').should('have.text', ` ${expectedDeploymentsCount}`);
        }

        it('when filter is not set', () => {
            setFilterId('');
            deploymentCountShouldBeEqualTo(testDeploymentIds.length);
        });

        it('when filter is set', () => {
            setFilterId('csys-environment-filter');
            deploymentCountShouldBeEqualTo(1);
        });
    });

    describe('should redirect to selected page on click', () => {
        const pageName = 'Deployments';
        const pageId = 'page_0';

        before(() => cy.addPage(pageName));

        function setWidgetConfiguration(filterId: string, pageToOpenOnClick: string) {
            cy.editWidgetConfiguration(widgetId, () => {
                cy.setSearchableDropdownValue('Filter ID', filterId);
                cy.setDropdownValues('Page to open on click', [pageToOpenOnClick]);
            });
        }

        function clickOnWidget() {
            cy.get('.statistic').click();
        }

        function verifyUrl(expectedPageId: string, expectedSearch: string) {
            cy.location('pathname').should('be.equal', `/console/page/${expectedPageId}`);
            cy.location('search').should('be.equal', expectedSearch);
        }

        it('when filter is not set', () => {
            setWidgetConfiguration('', pageName);
            clickOnWidget();
            verifyUrl(pageId, '');
        });

        it('when filter is set', () => {
            const filterId = 'csys-environment-filter';
            setWidgetConfiguration(filterId, pageName);
            clickOnWidget();
            verifyUrl(pageId, `?filterId=${filterId}`);
        });
    });

    describe('should allow configuring', () => {
        function setConfigurationField(fieldName: string, value: string) {
            cy.editWidgetConfiguration(widgetId, () => {
                cy.contains('.field', fieldName).find('input').clear().type(value);
            });
        }

        it('label', () => {
            const label = 'Kubernetes Clusters';
            setConfigurationField('Label', label);
            cy.get('.statistic .label').should('have.text', label);
        });

        it('image using icon', () => {
            const icon = 'box';
            setConfigurationField('Icon', icon);
            cy.get('.statistic .value i').should('have.class', icon);
        });

        it('image using URL', () => {
            const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png';
            setConfigurationField('Image URL', imageUrl);
            cy.get('.statistic .value img').should('have.attr', 'src', imageUrl);
        });
    });
});
