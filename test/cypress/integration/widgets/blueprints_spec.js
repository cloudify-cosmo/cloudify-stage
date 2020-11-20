describe('Blueprints widget', () => {
    const blueprintNamePrefix = 'blueprints_test';
    const emptyBlueprintName = `${blueprintNamePrefix}_empty`;

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('blueprints', { displayStyle: 'table', clickToDrillDown: true })
            .login()
            .deletePlugins()
            .uploadPluginFromCatalog('Utilities')
            .deleteDeployments(blueprintNamePrefix, true)
            .deleteBlueprints(blueprintNamePrefix, true)
            .uploadBlueprint('blueprints/simple.zip', emptyBlueprintName)
    );

    beforeEach(cy.refreshPage);

    function getBlueprintRow(blueprintName) {
        cy.get('input[placeholder^=Search]').clear().type(blueprintName);
        return cy.get(`#blueprintsTable_${blueprintName}`);
    }

    it('should open Composer with imported blueprint on "Edit a copy in Composer" icon click', () => {
        // Click the action icon
        getBlueprintRow(emptyBlueprintName).find('.external.share').click();

        cy.window()
            .its('open')
            .should('be.calledWith', `/composer/import/default_tenant/${emptyBlueprintName}/blueprint.yaml`);
    });

    it('should render in table view', () => {
        cy.get('div.blueprintsWidget table.blueprintsTable');
        cy.get('div.blueprintsWidget .segmentList').should('not.exist');
    });

    it('should drill down to blueprint on click', () => {
        getBlueprintRow(emptyBlueprintName).find('.blueprintName').click();

        cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
        cy.contains('.pageTitle', emptyBlueprintName);
    });

    it('should handle invalid blueprint url upload failure gracefully', () => {
        cy.contains('Upload').click();
        cy.get('input[name=blueprintUrl]').type('http://wp.pl').blur();
        cy.contains('Cancel').click();
    });

    describe('should upload a blueprint', () => {
        const url =
            'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-65/utilities-examples-cloudify_secrets.zip';

        beforeEach(() => {
            cy.contains('Upload').click();
            cy.get('input[name=blueprintUrl]').type(url).blur();
        });

        it('with default blueprint file', () => {
            cy.get('input[name=blueprintUrl]').clear().blur();
            cy.get('div[name=blueprintFileName] input').click();
            cy.contains('No results found.');

            cy.get('input[name=blueprintUrl]')
                .type(
                    'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-72/simple-hello-world-example.zip'
                )
                .blur();
            cy.contains('.modal', 'blueprint.yaml');

            cy.get('input[name=blueprintUrl]').clear().type(url).blur();

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

    it('should allow to deploy a blueprint', () => {
        getBlueprintRow(emptyBlueprintName).find('.rocket').click();

        const deploymentName = blueprintNamePrefix;

        cy.server();
        cy.route('PUT', `/console/sp?su=/deployments/${deploymentName}`).as('deploy');

        cy.get('input[name=deploymentName]').type(deploymentName);
        cy.contains('Show Data Types').click();
        cy.contains('.modal button', 'Close').click();
        const serverIp = '127.0.0.1';
        cy.get('textarea').type(serverIp);
        cy.contains('.modal .basic', 'Deploy').click();
        cy.get('.modal').should('not.exist');

        cy.wait('@deploy').then(({ requestBody }) => {
            expect(requestBody).to.deep.equal({
                blueprint_id: emptyBlueprintName,
                inputs: { server_ip: serverIp },
                visibility: 'tenant',
                skip_plugins_validation: false,
                runtime_only_evaluation: false
            });
        });
    });

    it('should allow to delete blueprint', () => {
        const blueprintName = `${blueprintNamePrefix}_delete`;

        cy.uploadBlueprint('blueprints/empty.zip', blueprintName);
        getBlueprintRow(blueprintName).find('.trash').click();
        cy.contains('.modal .button', 'Yes').click();

        cy.contains(blueprintName).should('not.exist');
    });

    describe('configuration', () => {
        it('should allow to disable drill down on click', () => {
            cy.editWidgetConfiguration('blueprints', () => cy.get('.checkbox').click());

            cy.contains(emptyBlueprintName).click();

            cy.get('div.blueprintsWidget table.blueprintsTable');
        });

        it('should allow to switch to catalog view', () => {
            cy.editWidgetConfiguration('blueprints', () =>
                cy.get('.dropdown').contains('Catalog').click({ force: true })
            );

            cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
            cy.get('div.blueprintsWidget .segmentList');
        });
    });
});
