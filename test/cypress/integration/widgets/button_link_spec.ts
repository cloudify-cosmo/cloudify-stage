describe('Button link widget', () => {
    const widgetId = 'buttonLink';
    before(() => cy.useWidgetWithDefaultConfiguration(widgetId));

    describe('should open configured link on click', () => {
        function clickButtonLink() {
            const label = 'Button Link';
            return cy.contains(label).click();
        }

        it('in new tab when link starts with "http" string', () => {
            const url = 'http://wp.pl';
            cy.editWidgetConfiguration(widgetId, () => cy.getField('URL address').find('input').clear().type(url));

            clickButtonLink();

            cy.window().its('open').should('be.calledWith', url);
        });

        it('in the same tab when link does not start with "http" string', () => {
            const url = '?test=true';
            cy.editWidgetConfiguration(widgetId, () => cy.getField('URL address').find('input').clear().type(url));

            clickButtonLink();

            cy.location().its('search').should('be.equal', url);
        });
    });

    describe('should allow configuring button', () => {
        it('color', () => {
            const color = 'violet';
            cy.setSearchableDropdownConfigurationField(widgetId, 'Color', color);
            cy.getWidget(widgetId).find('button').should('have.class', color);
        });

        it('label', () => {
            const label = 'Setup cloud account';
            cy.setStringConfigurationField(widgetId, 'Label', label);
            cy.getWidget(widgetId).find('button').should('have.text', label);
        });

        it('icon', () => {
            const icon = 'wizard';
            cy.setSearchableDropdownConfigurationField(widgetId, 'Icon', icon);
            cy.getWidget(widgetId).find('button i').should('have.class', icon);
        });

        it('basicness', () => {
            const basicButtonToggleName = 'Basic button';
            cy.setBooleanConfigurationField(widgetId, basicButtonToggleName, false);
            cy.getWidget(widgetId).find('button').should('not.have.class', 'basic');
            cy.setBooleanConfigurationField(widgetId, basicButtonToggleName, true);
            cy.getWidget(widgetId).find('button').should('have.class', 'basic');
        });

        it('full height', () => {
            const fullHeightToggleName = 'Full height';
            cy.setBooleanConfigurationField(widgetId, fullHeightToggleName, false);
            cy.getWidget(widgetId).find('button').should('not.have.attr', 'style');
            cy.setBooleanConfigurationField(widgetId, fullHeightToggleName, true);
            cy.getWidget(widgetId).find('button').should('have.attr', 'style').and('include', 'height: 100%');
        });
    });
});
