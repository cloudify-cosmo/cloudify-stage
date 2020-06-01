import _ from 'lodash';

describe('Blueprint Actions widget', () => {
    const blueprintName = 'blueprints_actions_test';

    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .deleteBlueprints(blueprintName, true)
            .uploadBlueprint('blueprints/empty.zip', blueprintName)
    );

    it('should open Composer with imported blueprint on "Edit a copy in Composer" button click', () => {
        // Navigate to Local Blueprints page
        cy.get('.local_blueprintsPageMenuItem').click();

        // Go into Blueprint page
        cy.get(`#blueprintsTable_${blueprintName} > td > .blueprintName`).click();

        cy.contains('Edit a copy in Composer').click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${blueprintName}/blueprint.yaml`);
    });
});
