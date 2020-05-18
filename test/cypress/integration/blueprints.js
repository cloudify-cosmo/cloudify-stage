import _ from 'lodash';

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
        // Navigate to Local Blueprints page
        cy.get('.local_blueprintsPageMenuItem').click();

        // Click the action icon
        cy.get(`#blueprintsTable_${blueprintName} .edit`).click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${blueprintName}/blueprint.yaml`);
    });
});
