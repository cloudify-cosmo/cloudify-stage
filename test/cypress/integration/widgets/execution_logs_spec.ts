describe('Execution logs widget', () => {
    const widgetId = 'executionLogs';
    const resourcePrefix = `${widgetId}_test_`;
    const blueprintName = `${resourcePrefix}blueprint`;
    const deploymentName = `${resourcePrefix}deployment`;

    before(() => {
        cy.activate()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(
                blueprintName,
                deploymentName,
                { server_ip: '127.0.0.1' },
                { display_name: deploymentName }
            )
            .executeWorkflow(deploymentName, 'install')
            .usePageMock(widgetId)
            .mockLogin();
    });

    it('when execution ID is not set should show a message', () => {
        cy.clearExecutionContext();
        cy.getWidget(widgetId).within(() => {
            cy.contains('Please select execution in order to see execution logs.');
        });
    });

    describe('when execution ID is set should show logs table and', () => {
        before(() => cy.clearDeploymentContext().setDeploymentContext(deploymentName).setExecutionContext('install'));

        it('allow to expand/collapse long messages', () => {
            const visibleFullMessage = "Starting 'install' workflow execution";
            const visibleMessagePart = "'install' workflow execution failed";
            const hiddenMessagePart = 'Traceback of cloudify_agent.installer.operations.create';

            const getExpandMessageIcon = () => cy.get('[aria-label="Expand message"]');
            const getCollapseMessageIcon = () => cy.get('[aria-label="Collapse message"]');

            cy.contains('td', visibleFullMessage).within(() => {
                getExpandMessageIcon().should('not.exist');
                getCollapseMessageIcon().should('not.exist');
            });

            cy.contains('td', visibleMessagePart).within(() => {
                getExpandMessageIcon().click();
                cy.contains(hiddenMessagePart);
                getCollapseMessageIcon().click();
            });
        });

        it('allows to show error causes', () => {
            const errorCausesMessagePart = "Task failed 'cloudify_agent.installer.operations.create'";
            const errorCauseType = 'AgentInstallerConfigurationError';
            const getErrorCausesIcon = () => cy.get('[aria-label="Show error causes"]');

            cy.contains('tr', errorCausesMessagePart).within(() => getErrorCausesIcon().click());
            cy.get('.modal').within(() => {
                cy.contains(errorCauseType);
                cy.clickButton('Close');
            });
        });
    });
});
