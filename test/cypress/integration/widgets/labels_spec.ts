describe('Labels widget', () => {
    const blueprintName = 'labels_test_blueprint';
    const deploymentName = 'labels_test_deployment';

    before(() => {
        cy.usePageMock('labels')
            .activate()
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: 'localhost' })
            .setDeploymentContext(deploymentName);
    });

    it('should allow to manage labels', () => {
        cy.contains('There are no Labels defined');

        cy.contains('Add').click();
        cy.get('.modal').within(() => {
            cy.get('.selection').click();
            cy.get('div[name=labelKey] > input').type('sample_key');
            cy.get('div[name=labelValue] > input').type('sample_value');
            cy.get('.add').click();
            cy.get('a.label').should('be.visible');
            cy.contains('button', 'Add').click();
        });

        cy.log('Verify label was added to the table');
        cy.get('.labelsTable').contains('sample_key');
        cy.get('.labelsTable').contains('sample_value');

        cy.log('Verify added label is not present in the add modal');
        cy.contains('Add').click();
        cy.get('.modal').within(() => {
            cy.get('a.label').should('not.exist');
            cy.contains('Cancel').click();
        });

        cy.log('Verify label value can be edited');
        cy.get('.labelsTable').within(() => {
            cy.get('.edit').click();
            cy.get('.cancel').click();
            cy.get('.edit').click();
            cy.get('input').type('!');
        });
        cy.contains('Only letters, digits and the characters "-", "." and "_" are allowed');
        cy.get('.labelsTable').within(() => {
            cy.get('input').should('be.visible');
            cy.get('.undo').should('not.exist');
            cy.get('input').type('_changed');
            cy.get('.undo').should('be.visible');
            cy.get('.check').click();
            cy.get('input').should('not.exist');
            cy.contains('sample_value_changed');
        });

        cy.log('Verify label can be removed');
        cy.get('.trash').click();
        cy.contains('Yes').click();
        cy.contains('There are no Labels defined');
    });
});
