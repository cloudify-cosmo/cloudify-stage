describe('Labels widget', () => {
    const blueprintName = 'labels_test_blueprint';
    const deploymentName = 'labels_test_deployment';
    const getCreatedLabel = () => cy.get('a.label');
    const getDropdownSelect = () => cy.get('.selection');
    const typeLabelName = (labelName: string) => cy.get('div[name=labelKey] > input').type(labelName);
    const typeLabelValue = (labelValue: string) => cy.get('div[name=labelValue] > input').type(labelValue);

    function addLabel() {
        getCreatedLabel().should('not.exist');
        getDropdownSelect().click();
        typeLabelName('sample_key');
        typeLabelValue('sample_value');
        cy.get('.add').click();
    }
    before(() => {
        cy.usePageMock('labels')
            .activate()
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: 'localhost' })
            .setLabels(deploymentName, [{ existing: 'existing' }])
            .setDeploymentContext(deploymentName);
    });

    it('should allow to add labels', () => {
        cy.contains('Add').click();
        cy.get('.modal').within(() => {
            addLabel();
            getCreatedLabel().should('be.visible');
            cy.contains('button', 'Add').click();
        });

        cy.log('Verify label was added to the table');
        cy.get('.labelsTable').contains('sample_key');
        cy.get('.labelsTable').contains('sample_value');
    });

    it('should allow to edit labels', () => {
        cy.contains('tr', 'existing').within(() => {
            cy.get('.edit').click();
            cy.get('.cancel').click();
            cy.get('.edit').click();
            cy.get('input').type('"');
        });
        cy.contains('The " character and control characters are not allowed.');

        cy.interceptSp('PATCH', `/deployments/${deploymentName}`).as('labelsUpdate');
        cy.contains('tr', 'existing').within(() => {
            cy.get('.undo').should('not.exist');
            cy.get('input').type('_changed');
            cy.get('.undo').should('be.visible');
            cy.get('.check').click();
            cy.get('input').should('not.exist');
        });
        cy.wait('@labelsUpdate');
        cy.contains('existing_changed');
    });

    it('should allow to remove labels', () => {
        cy.get('.trash').each(deleteIcon => {
            cy.wrap(deleteIcon).click();
            cy.contains('Yes').click();
            cy.wrap(deleteIcon).should('not.exist');
        });
        cy.contains('There are no Labels defined');
    });

    it('should enable Add button when at least one new label in the list', () => {
        cy.clickButton('Add');
        cy.get('.modal').within(() => {
            getCreatedLabel().should('not.exist');
            cy.contains('button', 'Add').should('have.attr', 'disabled');
            addLabel();
            getCreatedLabel().should('be.visible');
            cy.contains('button', 'Add').should('not.be.disabled');
        });
    });
});
