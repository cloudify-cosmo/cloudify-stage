describe('Blueprint Actions widget', () => {
    const blueprintName = 'blueprints_actions_test';

    before(() =>
        cy
            .usePageMock('blueprintActionButtons')
            .activate('valid_trial_license')
            .mockLogin()
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName)
    );

    it('should open Composer with imported blueprint on "Edit a copy in Composer" button click', () => {
        cy.setBlueprintContext(blueprintName);

        cy.contains('Edit a copy in Composer').click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${blueprintName}/blueprint.yaml`);
    });

    it('should open deployment modal', () => {
        cy.get('button#createDeploymentButton').click();

        cy.get('div.deployBlueprintModal').should('be.visible');
        cy.get('.actions > .ui:nth-child(1)').should('have.text', 'Cancel');
        cy.get('.actions > .ui:nth-child(2)').should('have.text', 'Deploy');
        cy.get('.actions > .ui:nth-child(3)').should('have.text', 'Deploy & Install');

        cy.get('.actions > .ui:nth-child(1)').click();
        cy.get('div.deployBlueprintModal').should('not.be.visible');
    });
});
