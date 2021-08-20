describe('Service Button widget', () => {
    const widgetId = 'serviceButton';

    before(() => cy.activate().useWidgetWithDefaultConfiguration(widgetId));

    it('should allow to show blueprint marketplace', () => {
        cy.contains('Create a service').click();
        cy.contains('Blueprint marketplace').should('be.visible');
        cy.contains('Close').click();
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
    });
});
