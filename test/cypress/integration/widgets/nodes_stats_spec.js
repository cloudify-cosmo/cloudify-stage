describe('Nodes statistics widget', () => {
    const blueprintName = 'nodes_stats_test';
    const deploymentName = 'nodes_stats_test';

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('nodesStats')
            .mockLogin()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName, { server_ip: '127.0.0.1' })
    );

    it('should display node statistics', () => {
        cy.setDeploymentContext(deploymentName);

        cy.get('.nodesStatsWidget tspan:contains(0)').should('have.length', 3);
        cy.get('.nodesStatsWidget tspan:contains(1)').should('have.length', 1);
    });
});
