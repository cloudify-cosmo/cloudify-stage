describe('Blueprints widget', () => {
    const blueprintName = 'blueprints_test';

    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName)
    );

    it('should open Composer with imported blueprint on "Edit a copy in Composer" icon click', () => {
        cy.visitPage('Local Blueprints');

        // Click the action icon
        cy.get(`#blueprintsTable_${blueprintName} .external.share`).click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${blueprintName}/blueprint.yaml`);
    });
});
