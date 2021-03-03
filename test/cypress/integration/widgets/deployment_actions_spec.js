describe('Deployment Action Buttons widget', () => {
    const blueprintName = 'deployment_action_buttons_test';
    const deploymentName = 'deployment_action_buttons_test';

    before(() =>
        cy
            .usePageMock('deploymentActionButtons')
            .activate()
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: '127.0.0.1' })
    );

    it('when deploymentId is not set in the context it should be disabled', () => {
        cy.get('button.executeWorkflowButton').should('have.attr', 'disabled');
        cy.get('button.deploymentActionsButton').should('have.attr', 'disabled');
    });

    describe('when deploymentId is set in the context', () => {
        beforeEach(() => cy.setDeploymentContext(deploymentName));

        it('should allow to execute a workflow', () => {
            cy.interceptSp('POST', `/executions`).as('executeWorkflow');

            cy.get('button.executeWorkflowButton').should('not.have.attr', 'disabled');
            cy.get('button.executeWorkflowButton').click();
            cy.get('.popupMenu > .menu').contains('Start').click();
            cy.get('.executeWorkflowModal').should('be.visible');
            cy.get('.executeWorkflowModal button.ok').click();

            cy.wait('@executeWorkflow');
            cy.get('.executeWorkflowModal').should('not.exist');
        });

        it('should allow to start an action on the deployment', () => {
            const siteName = 'deployment_action_buttons_test';
            cy.deleteSites(siteName).createSite({ name: siteName });
            cy.interceptSp('POST', `/deployments/${deploymentName}/set-site`).as('setSite');

            cy.get('button.deploymentActionsButton').should('not.have.attr', 'disabled');
            cy.get('button.deploymentActionsButton').click();

            cy.get('.popupMenu > .menu').contains('Set Site').click();
            cy.get('.modal').within(() => {
                cy.get('div[name="siteName"]').click();
                cy.get(`div[option-value="${siteName}"]`).click();
                cy.get('button.ok').click();
            });

            cy.wait('@setSite');
            cy.get('.modal').should('not.exist');
        });
    });
});
