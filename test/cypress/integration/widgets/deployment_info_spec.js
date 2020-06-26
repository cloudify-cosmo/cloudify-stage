describe('Deployment Info', () => {
    const blueprintName = 'deployment_info_test';
    const deploymentName = 'deployment_info_test';

    const verifyBlueprintName = () => {
        cy.get;
    };
    before(() => {
        cy.activate('valid_trial_license').login();

        cy.deleteDeployments(deploymentName, true)
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/simple.zip', blueprintName, 'blueprint.yaml', 'global')
            .deployBlueprint(blueprintName, deploymentName);

        cy.get('div.deploymentsPageMenuItem').click();
        cy.get('div.deployment_info_test').click();
    });

    it('is available in Deployment page', () => {
        cy.get('div.deploymentInfoWidget').should('be.visible');

        // TODO: Add checkers for all fields
    });

    it('allows to set visibility', () => {
        // TODO: Add better selectors
        cy.get('.ui > .row > .four > span > .green').click();
        cy.get('body > .ui > div > .ui > .hidden').click();
        cy.get('.dimmable > .ui > .ui > .actions > .ui:nth-child(2)').click();

        // TODO: Verify change
    });

    it('allows to customize view in widget configuration', () => {
        // TODO: Open edit mode, open widget configuration, turn off everything, check it is not visible?
    });

    it('shows Site Name only when it is not empty', () => {
        // TODO: Verify Site Name not shown, add deployment to site, verify it is visible
    });
});
