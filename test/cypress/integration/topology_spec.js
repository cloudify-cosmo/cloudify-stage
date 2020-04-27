describe('Topology', () => {
    const resourcePrefix = 'topology_test_';
    const blueprintId = `${resourcePrefix}bp`;
    const deploymentId = `${resourcePrefix}dep`;
    const blueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-42/simple-hello-world-example.zip';

    before(() => {
        cy.activate('valid_spire_license').login();

        cy.deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint(blueprintUrl, blueprintId)
            .deployBlueprint(blueprintId, deploymentId);
    });

    beforeEach(() => {
        cy.server();
        cy.route(/console\/sp\/\?su=\/summary/).as('getSummary');
    });

    it('is presented in Blueprint page', () => {
        // Navigate to Local Blueprints page
        cy.get('.local_blueprintsPageMenuItem').click();

        // Use search to limit number of presented blueprints
        cy.route(/console\/sp\/\?su=\/blueprints/).as('getBlueprints');
        cy.get('.blueprintsTable div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getBlueprints');
        cy.wait('@getSummary');

        // Go into Blueprint page
        cy.get(`#blueprintsTable_${blueprintId} > td > .blueprintName`).click();

        // Check Topology widget
        cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
        cy.get('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title').should(
            'have.text',
            'http_web_server'
        );
    });

    it('is presented in Deployment page', () => {
        // Navigate to Deployments page
        cy.get('.deploymentsPageMenuItem').click();

        // Use search to limit number of presented deployments
        cy.route(/console\/sp\/\?su=\/deployments/).as('getDeployments');
        cy.route(/console\/sp\/\?su=\/executions/).as('getExecutions');
        cy.get('.segmentList div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getDeployments');
        cy.wait('@getSummary');
        cy.wait('@getExecutions');

        // Go into Deployment page
        cy.get(`.ui.segment.${deploymentId} > .ui > .row`).click();

        // Check Topology widget
        cy.get('.widgetItem > div > .widgetContent > div > .scrollGlass').click();
        cy.get('#gridContainer > #gridSvg > #gridContent > .nodeContainer > .title').should(
            'have.text',
            'http_web_server'
        );
    });
});
