describe('Blueprints widget', () => {
    const blueprintNamePrefix = 'blueprints_test';
    const emptyBlueprintName = `${blueprintNamePrefix}_empty`;

    before(() =>
        cy
            .activate('valid_trial_license')
            .usePageMock('blueprints', { displayStyle: 'table', clickToDrillDown: true })
            .mockLogin()
    );

    beforeEach(() => cy.usePageMock('blueprints', { displayStyle: 'table', clickToDrillDown: true }).refreshTemplate());

    function getBlueprintRow(blueprintName) {
        cy.get('input[placeholder^=Search]').clear().type(blueprintName);
        cy.get('.blueprintsTable > tbody > tr').should('have.length', 1);
        return cy.get(`#blueprintsTable_${blueprintName}`);
    }

    describe('for specific blueprint', () => {
        before(() =>
            cy
                .deleteDeployments(blueprintNamePrefix, true)
                .deleteBlueprints(blueprintNamePrefix, true)
                .uploadBlueprint('blueprints/simple.zip', emptyBlueprintName)
                .refreshPage()
        );

        it('should open Composer with the blueprint imported on "Edit a copy in Composer" icon click', () => {
            // Click the action icon
            getBlueprintRow(emptyBlueprintName).find('.external.share').click();

            cy.window()
                .its('open')
                .should('be.calledWith', `/composer/import/default_tenant/${emptyBlueprintName}/blueprint.yaml`);
        });

        it('should allow to deploy the blueprint', () => {
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

        it('should allow to delete the blueprint', () => {
            const blueprintName = `${blueprintNamePrefix}_delete`;

            cy.uploadBlueprint('blueprints/empty.zip', blueprintName);
            getBlueprintRow(blueprintName).find('.trash').click();
            cy.contains('.modal .button', 'Yes').click();

            cy.contains(blueprintName).should('not.exist');
        });

        it('should do nothing on click when drill down is disabled', () => {
            cy.editWidgetConfiguration('blueprints', () => cy.get('input[name=clickToDrillDown]').parent().click());

            cy.contains(emptyBlueprintName).click();

            cy.get('div.blueprintsWidget table.blueprintsTable');
        });
    });

    describe('should render blueprint items', () => {
        beforeEach(() => {
            cy.route(RegExp(`/console/sp\\?su=/blueprints`), 'fixture:blueprints/blueprints');
            cy.refreshPage();
        });

        it('as a list', () => {
            cy.get('div.blueprintsWidget table.blueprintsTable');
            cy.get('div.blueprintsWidget .segmentList').should('not.exist');

            cy.contains('tr', 'pending').within(() => {
                cy.contains('Pending');
                cy.get('.rowActions').children().should('have.length', 0);
                cy.get('.warning').should('not.exist');
                cy.get('.blueprintName').click();
            });

            cy.contains('tr', 'uploading').within(() => {
                cy.contains('Uploading');
                cy.get('.rowActions').children().should('have.length', 0);
                cy.get('.warning').should('not.exist');
                cy.get('.blueprintName').click();
            });

            cy.contains('tr', 'extracting').within(() => {
                cy.contains('Extracting');
                cy.get('.rowActions').children().should('have.length', 0);
                cy.get('.warning').should('not.exist');
                cy.get('.blueprintName').click();
            });

            cy.contains('tr', 'parsing').within(() => {
                cy.contains('Parsing');
                cy.get('.rowActions').children().should('have.length', 0);
                cy.get('.warning').should('not.exist');
                cy.get('.blueprintName').click();
            });

            cy.contains('tr', 'failed_uploading').within(() => {
                cy.contains('Failed');
                cy.get('.trash').siblings().should('have.length', 0);
                cy.get('.blueprintName').click();
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('upload error');
            cy.contains('Failed uploading');

            cy.contains('tr', 'failed_extracting').within(() => {
                cy.contains('Failed');
                cy.get('.trash').siblings().should('have.length', 0);
                cy.get('.blueprintName').click();
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('extract error');
            cy.contains('Failed extracting');

            cy.contains('tr', 'failed_parsing').within(() => {
                cy.contains('Failed');
                cy.get('.trash').siblings().should('have.length', 0);
                cy.get('.blueprintName').click();
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('parse error');
            cy.contains('Failed parsing');

            cy.contains('tr', 'invalid').within(() => {
                cy.contains('Invalid');
                cy.get('.trash').siblings().should('have.length', 0);
                cy.get('.blueprintName').click();
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('invalid error');

            cy.route(RegExp(`/console/sp\\?su=/blueprints.*&state=uploaded`)).as('filteredBlueprints');
            cy.editWidgetConfiguration('blueprints', () => cy.get('input[name=hideFailedBlueprints]').parent().click());
            cy.wait('@filteredBlueprints');

            cy.contains('tr', 'uploaded').within(() => {
                cy.contains('Uploaded');
                cy.get('.rowActions').children().should('have.length', 3);
                cy.get('.warning').should('not.exist');
                cy.get('.blueprintName').click();
            });

            cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
            cy.contains('.pageTitle', 'uploaded');
        });

        it('as a catalog', () => {
            cy.editWidgetConfiguration('blueprints', () =>
                cy.get('.dropdown').contains('Catalog').click({ force: true })
            );

            cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
            cy.get('div.blueprintsWidget .segmentList');

            cy.get('.pending')
                .parent()
                .within(() => {
                    cy.contains('Pending');
                    cy.get('.actionButtons').should('not.exist');
                    cy.get('.warning').should('not.exist');
                    cy.get('a').click({ force: true });
                });

            cy.get('.uploading')
                .parent()
                .within(() => {
                    cy.contains('Uploading');
                    cy.get('.actionButtons').should('not.exist');
                    cy.get('.warning').should('not.exist');
                    cy.get('a').click({ force: true });
                });

            cy.get('.extracting')
                .parent()
                .within(() => {
                    cy.contains('Extracting');
                    cy.get('.actionButtons').should('not.exist');
                    cy.get('.warning').should('not.exist');
                    cy.get('a').click({ force: true });
                });

            cy.get('.parsing')
                .parent()
                .within(() => {
                    cy.contains('Parsing');
                    cy.get('.actionButtons').should('not.exist');
                    cy.get('.warning').should('not.exist');
                    cy.get('a').click({ force: true });
                });

            cy.get('.failed_uploading')
                .parent()
                .within(() => {
                    cy.contains('Failed');
                    cy.get('.actionButtons').children().should('have.length', 1);
                    cy.get('.trash');
                    cy.get('a').click({ force: true });
                    cy.get('.warning').trigger('mouseover');
                });
            cy.contains('upload error');
            cy.contains('Failed uploading');

            cy.get('.failed_extracting')
                .parent()
                .within(() => {
                    cy.contains('Failed');
                    cy.get('.actionButtons').children().should('have.length', 1);
                    cy.get('.trash');
                    cy.get('a').click({ force: true });
                    cy.get('.warning').trigger('mouseover');
                });
            cy.contains('extract error');
            cy.contains('Failed extracting');

            cy.get('.failed_parsing')
                .parent()
                .within(() => {
                    cy.contains('Failed');
                    cy.get('.actionButtons').children().should('have.length', 1);
                    cy.get('.trash');
                    cy.get('a').click({ force: true });
                    cy.get('.warning').trigger('mouseover');
                });
            cy.contains('parse error');
            cy.contains('Failed parsing');

            cy.get('.invalid')
                .parent()
                .within(() => {
                    cy.contains('Invalid');
                    cy.get('.actionButtons').children().should('have.length', 1);
                    cy.get('.trash');
                    cy.get('a').click({ force: true });
                    cy.get('.warning').trigger('mouseover');
                });
            cy.contains('invalid error');

            cy.route(RegExp(`/console/sp\\?su=/blueprints.*&state=uploaded`)).as('filteredBlueprints');
            cy.editWidgetConfiguration('blueprints', () => cy.get('input[name=hideFailedBlueprints]').parent().click());
            cy.wait('@filteredBlueprints');

            cy.get('.uploaded')
                .parent()
                .within(() => {
                    cy.contains('Uploaded');
                    cy.get('.actionButtons').children().should('have.length', 3);
                    cy.get('.warning').should('not.exist');
                    cy.get('a').click({ force: true });
                });

            cy.get('div.blueprintsWidget .segmentList').should('not.exist');
            cy.contains('.pageTitle', 'uploaded');
        });
    });

    describe('should open upload modal and', () => {
        beforeEach(() => cy.contains('Upload').click());

        it('should handle invalid blueprint url upload failure gracefully', () => {
            cy.get('input[name=blueprintUrl]').type('http://wp.pl').blur();
            cy.contains('Cancel').click();
        });

        describe('should upload a blueprint', () => {
            before(() => cy.deletePlugins().uploadPluginFromCatalog('Utilities'));

            const url =
                'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-65/utilities-examples-cloudify_secrets.zip';

            beforeEach(() => {
                cy.get('input[name=blueprintUrl]').type(url).blur();
                cy.server();
            });

            it('with default blueprint file', () => {
                cy.get('input[name=blueprintUrl]').clear().blur();
                cy.get('div[name=blueprintYamlFile] input').click();
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

                const getBlueprint = RegExp(`/console/sp\\?su=/blueprints/${blueprintName}`);
                cy.contains('0/4: Waiting for blueprint upload to start...');
                cy.route(getBlueprint, { state: 'uploading' });
                cy.contains('1/4: Uploading blueprint...');
                cy.route(getBlueprint, { state: 'extracting' });
                cy.contains('2/4: Extracting blueprint...');
                cy.route(getBlueprint, { state: 'parsing' });
                cy.contains('3/4: Parsing blueprint...');
                cy.route(getBlueprint, { state: 'uploaded' });

                getBlueprintRow(blueprintName).contains('read-secret-blueprint.yaml');
            });

            it('with manually specified blueprint file', () => {
                const blueprintName = `${blueprintNamePrefix}_specified_file`;
                const blueprintFileName = 'write-secret-blueprint.yaml';

                cy.get('input[name=blueprintName]').clear().type(blueprintName);
                cy.get('div[name=blueprintYamlFile] input').type(blueprintFileName);
                cy.get('.button.ok').click();

                cy.route(RegExp(`/console/sp\\?su=/blueprints/${blueprintName}`), { state: 'uploaded' });

                getBlueprintRow(blueprintName).contains(blueprintFileName);
            });

            it('and handle upload errors', () => {
                const blueprintName = `${blueprintNamePrefix}_upload_error`;

                cy.get('input[name=blueprintName]').clear().type(blueprintName).blur();
                cy.get('.button.ok').click();

                const error = 'error message';
                cy.route(RegExp(`/console/sp\\?su=/blueprints/${blueprintName}`), { state: 'failed_uploading', error });

                cy.contains('.header', 'Blueprint upload failed');
                cy.contains('li', error);
            });
        });
    });
});
