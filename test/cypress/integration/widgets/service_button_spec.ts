describe('Service Button widget', () => {
    const widgetId = 'serviceButton';
    const clickServiceButton = () => {
        cy.clickButton('Create a service');
    };

    before(() => cy.activate().useWidgetWithDefaultConfiguration(widgetId));

    it('should allow to show blueprint marketplace', () => {
        clickServiceButton();
        cy.contains('Blueprint Marketplace').should('be.visible');
    });

    describe('should allow configuring button', () => {
        it('color', () => {
            const color = 'red';
            cy.setSearchableDropdownConfigurationField(widgetId, 'Color', color);
            cy.get('button').should('have.class', color);
        });

        it('label', () => {
            const label = 'Create a cluster';
            cy.setStringConfigurationField(widgetId, 'Label', label);
            cy.get('button').should('have.text', label);
        });

        it('icon', () => {
            const icon = 'play';
            cy.setSearchableDropdownConfigurationField(widgetId, 'Icon', icon);
            cy.get('button i').should('have.class', icon);
        });

        it('basicness', () => {
            const basicButtonToggleName = 'Basic button';
            cy.setBooleanConfigurationField(widgetId, basicButtonToggleName, false);
            cy.get('button').should('not.have.class', 'basic');
            cy.setBooleanConfigurationField(widgetId, basicButtonToggleName, true);
            cy.get('button').should('have.class', 'basic');
        });

        it('defaultMarketplaceTab', () => {
            const marketplaceTabName = 'Terraform';
            const configurationFieldName = 'Default marketplace tab';

            cy.setStringConfigurationField(widgetId, configurationFieldName, marketplaceTabName);
            clickServiceButton();
            cy.containsActiveTab(marketplaceTabName);
        });
    });
});
