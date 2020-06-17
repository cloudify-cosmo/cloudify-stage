describe('Executions', () => {
    const blueprintName = 'executions_test';

    before(() => {
        cy.activate()
            .deleteDeployments(blueprintName, true)
            .deleteBlueprints(blueprintName, true)
            .deleteSites()
            .uploadBlueprint('blueprints/simple.zip', blueprintName, 'blueprint.yaml', 'global')
            .deployBlueprint(blueprintName, blueprintName, { server_ip: 'localhost' })
            .login();
    });

    it('allow to toggle graph auto focus mode', () => {
        cy.get('.loader').should('be.not.visible');
        cy.contains('Deployments').click();
        cy.get('.deploymentsWidget')
            .contains(blueprintName)
            .click();
        cy.executeWorkflow(blueprintName, 'install');
        cy.get('.executionsWidget')
            .contains('tr', 'failed')
            .contains('install')
            .click();
        cy.get('.play').click();
        cy.get('.play.green').click();
        cy.get('.play:not(.green)');
    });
});
