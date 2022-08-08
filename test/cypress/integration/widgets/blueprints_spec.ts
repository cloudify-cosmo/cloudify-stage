import type { BlueprintsWidgetConfiguration } from '../../../../widgets/blueprints/src/types';

describe('Blueprints widget', () => {
    const blueprintNamePrefix = 'blueprints_test';
    const emptyBlueprintName = `${blueprintNamePrefix}_empty`;
    const blueprintsWidgetConfiguration: Partial<BlueprintsWidgetConfiguration> = {
        displayStyle: 'table',
        clickToDrillDown: true,
        pollingTime: 5,
        showComposerOptions: true,
        filterRules: []
    };

    before(() =>
        cy
            .activate('valid_trial_license')
            .deleteDeployments(blueprintNamePrefix, true)
            .deleteBlueprints(blueprintNamePrefix, true)
            .deletePlugins()
            .usePageMock('blueprints', blueprintsWidgetConfiguration)
            .mockLogin()
    );

    beforeEach(() => cy.usePageMock('blueprints', blueprintsWidgetConfiguration).refreshTemplate());

    function closeDeployModal() {
        cy.contains('Deploy blueprint')
            .parent('.modal')
            .within(() => cy.contains('Cancel').click());
    }

    function getBlueprintRow(blueprintName: string) {
        cy.getSearchInput().clear().type(blueprintName);
        cy.get('.blueprintsTable > tbody > tr').should('have.length', 1);
        return cy.get(`#blueprintsTable_${blueprintName}`);
    }

    function getBlueprintMainFile() {
        return cy.getWidget('blueprintSources').contains('Main').parent();
    }

    describe('for specific blueprint', () => {
        before(() => cy.uploadBlueprint('blueprints/simple.zip', emptyBlueprintName).refreshPage());

        const editCopyInComposerButtonSelector = '[title="Edit a copy in Composer"]';

        it('should open Composer with the blueprint imported on "Edit a copy in Composer" icon click', () => {
            getBlueprintRow(emptyBlueprintName).find(editCopyInComposerButtonSelector).click();

            cy.window()
                .its('open')
                .should('be.calledWith', `/composer/import/default_tenant/${emptyBlueprintName}/blueprint.yaml`);
        });

        it('should not show the "Edit a copy in Composer" button if it is turned off in the configuration', () => {
            cy.editWidgetConfiguration('blueprints', () => {
                cy.getField('Show Composer options')
                    .find('input')
                    // NOTE: force, as the checkbox from Semantic UI is
                    // class=hidden which prevents Cypress from clicking it
                    .click({ force: true });
            });
            getBlueprintRow(emptyBlueprintName).find(editCopyInComposerButtonSelector).should('not.exist');
        });

        it('should allow to deploy the blueprint', () => {
            getBlueprintRow(emptyBlueprintName).find('.rocket').click();

            const deploymentId = blueprintNamePrefix;
            const deploymentName = `${deploymentId}_name`;

            cy.interceptSp('PUT', `/deployments/${deploymentId}`).as('deploy');

            cy.get('input[name=deploymentName]').type(deploymentName);
            cy.openAccordionSection('Advanced');
            cy.get('input[name=deploymentId]').clear().type(deploymentId);
            cy.openAccordionSection('Deployment Inputs');
            cy.get('button[aria-label="Show Data Types"]').click();
            cy.contains('.modal button', 'Close').click();

            const serverIp = '127.0.0.1';
            cy.get('textarea').type(serverIp);

            cy.openAccordionSection('Deployment Metadata');
            cy.contains('div', 'Labels').find('.selection').click();
            cy.get('div[name=labelKey] > input').type('sample_key');
            cy.get('div[name=labelValue] > input').type('sample_value', { force: true });
            cy.get('.add').click();
            cy.get('a.label').should('be.visible');

            cy.selectAndClickDeploy();
            cy.get('.modal').should('not.exist');

            cy.wait('@deploy').then(({ request }) => {
                expect(request.body).to.deep.equal({
                    blueprint_id: emptyBlueprintName,
                    display_name: deploymentName,
                    inputs: { server_ip: serverIp },
                    labels: [{ sample_key: 'sample_value' }],
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

            cy.get('div.blueprintsWidget table.blueprintsTable').should('exist');
        });
    });

    describe('should render blueprint items', () => {
        beforeEach(() => {
            cy.interceptSp('POST', '/searches/blueprints', { fixture: 'blueprints/blueprints' });
            cy.interceptSp('POST', {
                pathname: '/searches/blueprints',
                query: {
                    state: 'uploaded'
                }
            }).as('filteredBlueprints');
            cy.refreshPage();
        });

        it('as a list', () => {
            cy.get('div.blueprintsWidget table.blueprintsTable').should('exist');
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
            function getBlueprintSegment(blueprintName: string) {
                return cy.getByTestId(blueprintName);
            }

            cy.editWidgetConfiguration('blueprints', () =>
                cy.get('.dropdown').contains('Catalog').click({ force: true })
            );

            cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
            cy.get('div.blueprintsWidget .segmentList').should('exist');

            getBlueprintSegment('pending').within(() => {
                cy.contains('Pending');
                cy.get('.actionButtons').should('not.exist');
                cy.get('.warning').should('not.exist');
                cy.get('a').click({ force: true });
            });

            getBlueprintSegment('uploading').within(() => {
                cy.contains('Uploading');
                cy.get('.actionButtons').should('not.exist');
                cy.get('.warning').should('not.exist');
                cy.get('a').click({ force: true });
            });

            getBlueprintSegment('extracting').within(() => {
                cy.contains('Extracting');
                cy.get('.actionButtons').should('not.exist');
                cy.get('.warning').should('not.exist');
                cy.get('a').click({ force: true });
            });

            getBlueprintSegment('parsing').within(() => {
                cy.contains('Parsing');
                cy.get('.actionButtons').should('not.exist');
                cy.get('.warning').should('not.exist');
                cy.get('a').click({ force: true });
            });

            getBlueprintSegment('failed_uploading').within(() => {
                cy.contains('Failed');
                cy.get('.actionButtons').children().should('have.length', 1);
                cy.get('.trash');
                cy.get('a').click({ force: true });
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('upload error');
            cy.contains('Failed uploading');

            getBlueprintSegment('failed_extracting').within(() => {
                cy.contains('Failed');
                cy.get('.actionButtons').children().should('have.length', 1);
                cy.get('.trash').should('exist');
                cy.get('a').click({ force: true });
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('extract error');
            cy.contains('Failed extracting');

            getBlueprintSegment('failed_parsing').within(() => {
                cy.contains('Failed');
                cy.get('.actionButtons').children().should('have.length', 1);
                cy.get('.trash').should('exist');
                cy.get('a').click({ force: true });
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('parse error');
            cy.contains('Failed parsing');

            getBlueprintSegment('invalid').within(() => {
                cy.contains('Invalid');
                cy.get('.actionButtons').children().should('have.length', 1);
                cy.get('.trash').should('exist');
                cy.get('a').click({ force: true });
                cy.get('.warning').trigger('mouseover');
            });
            cy.contains('invalid error');

            cy.editWidgetConfiguration('blueprints', () => cy.get('input[name=hideFailedBlueprints]').parent().click());
            cy.wait('@filteredBlueprints');

            getBlueprintSegment('uploaded').within(() => {
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
        beforeEach(() => {
            cy.contains('Upload').click();
            cy.contains('Upload a blueprint package').click();
        });

        it('should handle invalid blueprint url upload failure gracefully', () => {
            cy.get('input[name=blueprintUrl]').type('http://wp.pl').blur();
            cy.contains('Cancel').click();
        });

        describe('should upload a blueprint', () => {
            const url =
                'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-65/utilities-examples-cloudify_secrets.zip';

            beforeEach(() => cy.get('input[name=blueprintUrl]').type(url).blur());

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

                const getBlueprint = `/blueprints/${blueprintName}`;
                const responses = ['uploading', 'extracting', 'parsing', 'uploaded'].map(state => ({ state }));
                cy.interceptSp('GET', getBlueprint, req => req.reply(responses.shift() || {}));

                cy.contains('1/5: Waiting for blueprint upload to start...');
                cy.contains('2/5: Uploading blueprint...');
                cy.contains('3/5: Extracting blueprint...');
                cy.contains('4/5: Parsing blueprint...');
                closeDeployModal();
                getBlueprintMainFile().contains('read-secret-blueprint.yaml');
            });

            it('with manually specified blueprint file', () => {
                const blueprintName = `${blueprintNamePrefix}_specified_file`;
                const blueprintFileName = 'write-secret-blueprint.yaml';

                cy.get('input[name=blueprintName]').clear().type(blueprintName);
                cy.get('div[name=blueprintYamlFile] input').type(blueprintFileName);
                cy.get('.button.ok').click();

                closeDeployModal();
                getBlueprintMainFile().contains(blueprintFileName);
            });

            it('and handle upload errors', () => {
                const blueprintName = `${blueprintNamePrefix}_upload_error`;

                cy.get('input[name=blueprintName]').clear().type(blueprintName).blur();
                cy.get('input[name=imageUrl]').type('http://invalid-url.invalid-domain');
                cy.contains('button', 'Upload').click();

                cy.contains('Please provide valid URL for blueprint icon');

                cy.get('input[name=imageUrl]').clear();
                const error = 'error message';
                cy.interceptSp('GET', `/blueprints/${blueprintName}`, {
                    state: 'failed_uploading',
                    error
                });
                cy.contains('button', 'Upload').click();

                cy.contains('.header', 'Blueprint upload failed');
                cy.contains('li', error);
            });
        });
    });

    describe('should allow uploading blueprint from', () => {
        it('Blueprint Marketplace', () => {
            cy.contains('Upload').click();
            cy.contains('Upload from Marketplace').click();

            cy.contains('Blueprint Marketplace');
            cy.containsActiveTab('AWS');
        });

        it('Composer', () => {
            cy.window().then(win => {
                cy.stub(win, 'open').as('open');
            });

            cy.contains('Upload').click();
            cy.contains('Generate in the Composer').click();

            cy.get('@open').should('be.calledWith', '/composer/');
        });
    });

    describe('configuration', () => {
        it('should allow to hide composer menu item', () => {
            cy.contains('Upload').click();
            cy.contains('Upload from Marketplace').should('be.visible');
            cy.contains('Upload a blueprint package').should('be.visible');
            cy.contains('Generate in the Composer').should('be.visible');

            cy.setBooleanConfigurationField('blueprints', 'Show Composer options', false);

            cy.contains('Upload').click();
            cy.contains('Generate in the Composer').should('not.exist');
            cy.contains('Upload from Marketplace').should('be.visible');
            cy.contains('Upload a blueprint package').should('be.visible');
        });
    });
});
