describe('should allow configuring deployment button', () => {
    const resourcePrefix = 'deploy_test_';
    const labelsBlueprint = `${resourcePrefix}labels`;

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentButton').mockLogin();
        cy.uploadBlueprint('blueprints/labels.zip', labelsBlueprint);
    });

    beforeEach(() => {
        cy.refreshPage();
        cy.interceptSp('POST', { pathname: '/searches/blueprints', query: { state: 'uploaded' } }).as(
            'uploadedBlueprints'
        );
        cy.get('div.deploymentButtonWidget button').click();
    });

    const openDropdown = (divName: string) => {
        return cy.get(`div[name="${divName}"]`).click();
    };

    const selectLabelValue = (value: string) => {
        openDropdown('labelValue').within(() => {
            cy.get('input').type(value);
            cy.contains(`New value ${value}`).click();
        });
    };

    it('filters blueprints according to blueprint label filter rules in widget configuration', () => {
        cy.get('div.deployBlueprintModal').within(() => {
            openDropdown('blueprintName').within(() => {
                cy.get('[role="listbox"] > *').should('not.have.length', 1);
            });
            cy.get('.actions > .ui:nth-child(1)').click();
        });
        cy.editWidgetConfiguration('deploymentButton', () => {
            cy.clickButton('Add new rule');
            openDropdown('ruleOperator').contains('[role="option"]', 'is one of').click();
            openDropdown('labelKey').within(() => {
                const labelKey = 'arch';
                cy.get('input').type(labelKey);
                cy.get(`[role="listbox"] > *`).click();
            });
            selectLabelValue('k8s');
            selectLabelValue('docker');
        });
        cy.clickButton('Create deployment');
        cy.get('div.deployBlueprintModal').within(() => {
            openDropdown('blueprintName').within(() => {
                cy.get('[role="listbox"] > *').should('have.length', 1);
                cy.get('[role="option"]').should('contain.text', labelsBlueprint);
            });
            cy.get('.actions > .ui:nth-child(1)').click();
        });
    });

    it('color', () => {
        const color = 'red';
        cy.setSearchableDropdownConfigurationField(widgetId, 'Color', color);
        cy.get('button').should('have.class', color);
    });

    it('icon', () => {
        const icon = 'play';
        cy.setSearchableDropdownConfigurationField(widgetId, 'Icon', icon);
        cy.get('button i').should('have.class', icon);
    });
});