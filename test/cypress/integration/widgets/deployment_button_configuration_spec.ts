describe('Create deployment button widget should allow configuring', () => {
    const widgetId = 'deploymentButton';
    const resourcePrefix = 'deploy_btn_config_test_';
    const labelsBlueprint = `${resourcePrefix}labels`;
    const withoutLabelsBlueprint = `${resourcePrefix}without_labels`;

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentButton').mockLogin();
        cy.deleteBlueprints(resourcePrefix, true).uploadBlueprint('blueprints/empty.zip', withoutLabelsBlueprint);
    });

    beforeEach(() => {
        cy.refreshPage();
        cy.interceptSp('POST', { pathname: '/searches/blueprints', query: { state: 'uploaded' } }).as(
            'uploadedBlueprints'
        );
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

    it('label filter rules', () => {
        cy.get('div.deploymentButtonWidget button').click();
        cy.get('div.deployBlueprintModal').within(() => {
            openDropdown('blueprintName').within(() => {
                cy.contains(withoutLabelsBlueprint).should('exist');
                cy.contains(labelsBlueprint).should('not.exist');
            });
            cy.contains('Cancel').click();
        });
        cy.uploadBlueprint('blueprints/labels.zip', labelsBlueprint);
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
                cy.contains(labelsBlueprint).should('exist');
            });
            cy.contains('Cancel').click();
        });
    });
});
