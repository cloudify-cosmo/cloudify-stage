describe('Service Button widget', () => {
    const widgetId = 'serviceButton';
    const widgetSelector = `.${widgetId}Widget`;

    const clickServiceButton = () => {
        cy.get(`${widgetSelector} button`).click();
    };

    before(() => cy.activate().useWidgetWithDefaultConfiguration(widgetId));
    beforeEach(() => cy.refreshPage());

    it('should allow to show blueprint marketplace page', () => {
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

        it('default marketplace tab', () => {
            const marketplaceTabNames = ['Terraform', 'Kubernetes', 'AWS'];
            const configurationFieldName = 'Default marketplace tab';

            marketplaceTabNames.forEach((marketplaceTabName, tabIndex) => {
                const isFirstTabChecked = tabIndex === 0;

                if (!isFirstTabChecked) {
                    cy.refreshPage();
                }

                cy.setStringConfigurationField(widgetId, configurationFieldName, marketplaceTabName);
                clickServiceButton();
                cy.containsActiveTab(marketplaceTabName);
            });
        });
    });
});
