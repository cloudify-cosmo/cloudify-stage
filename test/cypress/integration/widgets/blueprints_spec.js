describe('Blueprints widget', () => {
    const blueprintNamePrefix = 'blueprints_test';
    const emptyBlueprintName = 'blueprints_test_empty';

    before(() =>
        cy
            .activate('valid_trial_license')
            .login()
            .uploadPluginFromCatalog('Utilities')
            .deleteDeployments(blueprintNamePrefix, true)
            .deleteBlueprints(blueprintNamePrefix, true)
            .uploadBlueprint('blueprints/empty.zip', emptyBlueprintName)
    );

    beforeEach(() => cy.visitPage('Local Blueprints'));

    function getBlueprintRow(bluerintName) {
        return cy.get(`#blueprintsTable_${bluerintName}`);
    }

    it('should open Composer with imported blueprint on "Edit a copy in Composer" icon click', () => {
        // Click the action icon
        getBlueprintRow(emptyBlueprintName).find('.external.share').click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${emptyBlueprintName}/blueprint.yaml`);
    });

    it('should render in table view by default', () => {
        cy.get('div.blueprintsWidget table.blueprintsTable');
        cy.get('div.blueprintsWidget .segmentList').should('not.exist');
    });

    it('should drill down to blueprint on click', () => {
        cy.contains(emptyBlueprintName).click();

        cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
        cy.contains('.pageTitle', emptyBlueprintName);
    });

    describe('should upload a blueprint', () => {
        beforeEach(() => {
            cy.contains('Upload').click();
            cy.get('input[name=blueprintUrl]')
                .type(
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-65/utilities-examples-cloudify_secrets.zip'
                )
                .blur();
        });

        it('with default blueprint file', () => {
            const blueprintName = `${blueprintNamePrefix}_default_file`;

            cy.get('input[name=blueprintName]').clear().type(blueprintName);
            cy.get('.button.ok').click();

            getBlueprintRow(blueprintName).contains('read-secret-blueprint.yaml');
        });

        it('with manually specified blueprint file', () => {
            const blueprintName = `${blueprintNamePrefix}_specified_file`;
            const blueprintFileName = 'write-secret-blueprint.yaml';

            cy.get('input[name=blueprintName]').clear().type(blueprintName);
            cy.get('div[name=blueprintFileName] input').type(blueprintFileName);
            cy.get('.button.ok').click();

            getBlueprintRow(blueprintName).contains(blueprintFileName);
        });
    });

    describe('configuration', () => {
        beforeEach(() => {
            cy.contains('Reset Templates').click({ force: true });
            cy.contains('.modal .button', 'Yes').click();
            cy.visitPage('Local Blueprints');
        });

        it('should allow to switch to catalog view', () => {
            cy.editWidgetConfiguration('blueprints', () =>
                cy.get('.dropdown').contains('Catalog').click({ force: true })
            );

            cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
            cy.get('div.blueprintsWidget .segmentList');
        });

        it('should allow to disable drill down on click', () => {
            cy.editWidgetConfiguration('blueprints', () => cy.get('.checkbox').click());

            cy.contains(emptyBlueprintName).click();

            cy.get('div.blueprintsWidget table.blueprintsTable');
            cy.contains('.pageTitle', 'Local Blueprints');
        });
    });

    it('should allow to deploy a blueprint', () => {
        getBlueprintRow(emptyBlueprintName).find('.rocket').click();

        cy.get('input[name=deploymentName]').type(blueprintNamePrefix);
        cy.contains('.modal .basic', 'Deploy').click();

        cy.visitPage('Local Blueprints');
        getBlueprintRow(emptyBlueprintName).find('.label.green').should('have.text', '1');
    });

    it('should allow to delete blueprint', () => {
        const blueprintName = `${blueprintNamePrefix}_delete`;

        cy.uploadBlueprint('blueprints/empty.zip', blueprintName);
        getBlueprintRow(blueprintName).find('.trash').click();
        cy.contains('.modal .button', 'Yes').click();

        cy.contains(blueprintName).should('not.exist');
    });
});
