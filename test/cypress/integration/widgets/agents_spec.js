describe('Agents widget', () => {
    const blueprintName = 'agents_test_blueprint';
    const deploymentName = 'agents_test_deployment';

    before(() =>
        cy
            .activate()
            .login()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: 'localhost' })
            .visitPage('System Resources')
    );

    it('should allow to validate agent', () => {
        cy.contains('Validate').click();
        cy.get('div[name=deploymentId] input').type(deploymentName);
        cy.get('div[name=nodeId]').click();
        cy.get('div[name=nodeId] .item').click();
        cy.get('div[name=nodeInstanceId]').click();
        cy.get('div[name=nodeInstanceId] .item').click();
        cy.contains('.modal button', 'Validate').click();
        cy.contains('Close').click();
    });

    it('should allow to install new agent', () => {
        cy.contains('Install').click();
        cy.get('div[name=deploymentId] input').type(deploymentName);
        cy.get('div[name=nodeId]').click();
        cy.get('div[name=nodeId] .item').click();
        cy.get('div[name=nodeInstanceId]').click();
        cy.get('div[name=nodeInstanceId] .item').click();
        cy.contains('.modal button', 'Install').click();
        cy.contains('Close').click();
    });
});
