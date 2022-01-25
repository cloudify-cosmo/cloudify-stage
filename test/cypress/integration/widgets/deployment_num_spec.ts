describe('Number of Deployments widget', () => {
    const widgetId = 'deploymentNum';
    const resourcePrefix = `${widgetId}_test_`;
    const testBlueprintId = `${resourcePrefix}bp`;
    const serviceDeploymentId1 = `${resourcePrefix}service_1`;
    const serviceDeploymentId2 = `${resourcePrefix}service_2`;
    const environmentDeploymentId = `${resourcePrefix}environment`;
    const testDeploymentIds = [serviceDeploymentId1, serviceDeploymentId2, environmentDeploymentId];

    before(() => cy.activate().useWidgetWithDefaultConfiguration(widgetId, { pollingTime: 3 }));

    beforeEach(() => cy.visitTestPage());

    describe('should display correct number of deployments', () => {
        before(() => {
            cy.killRunningExecutions()
                .deleteDeployments('', true)
                .deleteBlueprints(resourcePrefix, true)
                .uploadBlueprint('blueprints/empty.zip', testBlueprintId);
            testDeploymentIds.forEach(deploymentId => cy.deployBlueprint(testBlueprintId, deploymentId));
            cy.setLabels(environmentDeploymentId, [{ 'csys-obj-type': 'environment' }]);
        });

        beforeEach(() => cy.interceptSp('GET', { pathname: '/deployments' }).as('fetchDeployments'));

        function setFilterId(filterId: string) {
            cy.setSearchableDropdownConfigurationField(widgetId, 'Filter ID', filterId);
        }

        function deploymentsCountShouldBeEqualTo(expectedDeploymentsCount: number) {
            cy.get('.statistic .value').should($div =>
                expect(Number.parseInt($div.text(), 10)).to.eq(expectedDeploymentsCount)
            );
        }

        it('when filter is not set', () => {
            setFilterId('');
            cy.wait('@fetchDeployments');
            deploymentsCountShouldBeEqualTo(testDeploymentIds.length);
        });

        it('when filter is set', () => {
            setFilterId('csys-environment-filter');
            cy.wait('@fetchDeployments');
            deploymentsCountShouldBeEqualTo(1);
        });
    });

    describe('should redirect to selected page on click', () => {
        const pageName = 'Deployments';
        const pageId = 'page_0';

        before(() => cy.addPage(pageName));

        function setWidgetConfiguration(filterId: string, pageToOpenOnClick: string) {
            cy.editWidgetConfiguration(widgetId, () => {
                cy.setSearchableDropdownValue('Filter ID', filterId);
                cy.setSingleDropdownValue('Page to open on click', pageToOpenOnClick);
            });
        }

        function clickOnWidget() {
            cy.get('.statistic').click();
        }

        function verifyUrl(expectedPageId: string, expectedSearch: string) {
            cy.verifyLocationByPageId(expectedPageId);
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
        it('label', () => {
            const label = 'Kubernetes Clusters';
            cy.setStringConfigurationField(widgetId, 'Label', label);
            cy.get('.statistic .label').should('have.text', label);
        });

        it('image using icon', () => {
            const icon = 'box';
            cy.setSearchableDropdownConfigurationField(widgetId, 'Icon', icon);
            cy.get('.statistic .value i').should('have.class', icon);
        });

        it('image using URL', () => {
            const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png';
            cy.setStringConfigurationField(widgetId, 'Image URL', imageUrl);
            cy.get('.statistic .value img').should('have.attr', 'src', imageUrl);
        });
    });
});
