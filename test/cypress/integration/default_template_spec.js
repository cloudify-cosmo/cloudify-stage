describe('Default template', () => {
    const blueprintName = 'blueprints_sources_test';
    const deploymentName = 'blueprints_sources_test_dep';

    before(() =>
        cy
            .activate()
            .login()
            .deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName)
            .deployBlueprint(blueprintName, deploymentName)
    );

    it('should have Local Blueprints page', () => {
        cy.visitPage('Local Blueprints');
        cy.get(`tr#blueprintsTable_${blueprintName}`).click();
        cy.get('.blueprintSourcesWidget .widgetItem').scrollIntoView().should('be.visible');
    });

    it('should have Deployments page', () => {
        cy.visitPage('Deployments');
        cy.contains(deploymentName).click();
        cy.contains('Deployment Info').click();
        cy.get('.blueprintSourcesWidget .widgetItem').scrollIntoView().should('be.visible');
    });
});
