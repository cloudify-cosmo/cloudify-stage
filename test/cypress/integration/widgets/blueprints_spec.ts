import { waitUntilNotEmpty } from 'test/cypress/support/resource_commons';
import type { BlueprintsWidgetConfiguration } from '../../../../widgets/blueprints/src/types';

describe('Blueprints widget', () => {
    const blueprintNamePrefix = 'blueprints_test';
    const emptyBlueprintName = `${blueprintNamePrefix}_empty`;
    const errorBoxSelector = '.error.message';
    const marketplaceTabs = [
        {
            name: 'VM Blueprint Examples',
            url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/vm-examples.json'
        },
        {
            name: 'Kubernetes Blueprint Examples',
            url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/k8s-examples.json'
        },
        {
            name: 'Orchestrator Blueprint Examples',
            url: 'https://repository.cloudifysource.org/cloudify/blueprints/6.3/orc-examples.json'
        }
    ];
    const blueprintsWidgetConfiguration: Partial<BlueprintsWidgetConfiguration> = {
        displayStyle: 'table',
        clickToDrillDown: true,
        pollingTime: 5,
        showComposerOptions: true,
        marketplaceTabs,
        marketplaceDisplayStyle: 'catalog',
        filterRules: [],
        marketplaceColumnsToShow: ['Name', 'Description']
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

    beforeEach(() => cy.refreshTemplate());

    function getBlueprintRow(blueprintName: string) {
        cy.getSearchInput().clear().type(blueprintName);
        cy.get('.blueprintsTable > tbody > tr').should('have.length', 1);
        return cy.get(`#blueprintsTable_${blueprintName}`);
    }

    function typeToTextarea(fieldName: string, text: string) {
        cy.getField(fieldName).find('textarea').clear().type(text);
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
            cy.editWidgetConfiguration('blueprints', () =>
                cy.get('.dropdown').contains('Catalog').click({ force: true })
            );

            cy.get('div.blueprintsWidget table.blueprintsTable').should('not.exist');
            cy.get('div.blueprintsWidget .segmentList').should('exist');

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
                    cy.get('.trash').should('exist');
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
                    cy.get('.trash').should('exist');
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
                    cy.get('.trash').should('exist');
                    cy.get('a').click({ force: true });
                    cy.get('.warning').trigger('mouseover');
                });
            cy.contains('invalid error');

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
        beforeEach(() => {
            cy.contains('Upload').click();
            cy.contains('Upload a blueprint package').click();
        });

        it('should handle invalid blueprint url upload failure gracefully', () => {
            cy.get('input[name=blueprintUrl]').type('http://wp.pl').blur();
            cy.contains('Cancel').click();
        });

        it('should successfully dismiss error messages', () => {
            cy.get('.modal').within(() => {
                cy.contains('button', 'Upload').click();

                cy.get(errorBoxSelector).within(() => {
                    cy.get('.header').should('contain', 'Errors');
                    cy.get('.close.icon').click();
                });

                cy.get(errorBoxSelector).should('not.exist');
            });
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

                getBlueprintRow(blueprintName).contains('read-secret-blueprint.yaml');
            });

            it('with manually specified blueprint file', () => {
                const blueprintName = `${blueprintNamePrefix}_specified_file`;
                const blueprintFileName = 'write-secret-blueprint.yaml';

                cy.get('input[name=blueprintName]').clear().type(blueprintName);
                cy.get('div[name=blueprintYamlFile] input').type(blueprintFileName);
                cy.get('.button.ok').click();

                getBlueprintRow(blueprintName).contains(blueprintFileName);
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

    describe('should open upload from marketplace modal and', () => {
        beforeEach(() => {
            cy.contains('Upload').click();
            cy.contains('Upload from Marketplace').click();
        });

        it('have blueprint catalog widget', () => {
            cy.get('.modal').within(() => {
                cy.contains('.header', 'Blueprint marketplace');
                cy.get('.tabular > a.item').should('have.length', marketplaceTabs.length);
                cy.get('.blueprintCatalogWidget').should('be.visible');
            });
        });
    });

    describe('should open upload from Terraform module modal and', () => {
        const terraformTemplatesBaseUrl =
            'https://github.com/cloudify-cosmo/cloudify-stage/raw/master/test/cypress/fixtures/terraform/';
        const singleModuleTerraformTemplateUrl = `${terraformTemplatesBaseUrl}single.zip`;
        const multipleModulesTerraformTemplateUrl = `${terraformTemplatesBaseUrl}multiple.zip`;
        const singleModuleTerraformTemplatePath = `terraform/single.zip`;
        const multipleModulesTerraformTemplatePath = 'terraform/multiple.zip';

        beforeEach(cy.refreshPage);

        function openTerraformModal() {
            cy.contains('Upload').click();
            cy.contains('Upload from Terraform module').click();
        }

        function setTemplateDetails(template: string, modulePath: string, fromFile = false) {
            if (fromFile) {
                cy.get('input[name=terraformUrlOrFileFile]').attachFile(template);
            } else {
                cy.get('input[name="terraformUrlOrFileUrl"]').clear().type(template).blur();
            }
            cy.setSingleDropdownValue('Terraform module folder', modulePath);
        }

        function selectVariableSource(source: string) {
            cy.get('td:eq(1) .selection').click();
            cy.contains('.item', source).click();
        }

        function addFirstSegmentRow(segmentName: string) {
            cy.contains(segmentName).click().parent().clickButton('Add');
        }

        function getSegment(segmentName: string) {
            return cy.contains('.segment', segmentName);
        }

        it('validate individual form fields', () => {
            openTerraformModal();

            cy.get('.modal').within(() => {
                cy.log('Check mandatory fields validations');
                addFirstSegmentRow('Variables');
                addFirstSegmentRow('Environment variables');
                addFirstSegmentRow('Outputs');
                cy.clickButton('Create');
                cy.contains('Errors in the form').scrollIntoView();
                cy.contains('Please provide blueprint name').should('be.visible');
                cy.contains('Please provide Terraform template').should('be.visible');
                cy.contains('Please provide resource location').should('be.visible');
                cy.contains('Please provide variable key').should('be.visible');
                cy.contains('Please provide variable source').should('be.visible');
                cy.contains('Please provide environment variable key').should('be.visible');
                cy.contains('Please provide environment variable source').should('be.visible');
                cy.contains('Please provide output name').should('be.visible');
                cy.contains('Please provide output type').should('be.visible');
                cy.contains('Please provide Terraform output').should('be.visible');
                cy.get('.error.message li').should('have.length', 10);

                getSegment('Variables').within(() => {
                    selectVariableSource('Secret');
                });
                getSegment('Environment variables').within(() => {
                    selectVariableSource('Secret');
                });
                cy.clickButton('Create');
                cy.contains('Errors in the form').scrollIntoView();
                cy.contains('Please provide variable name').should('be.visible');
                cy.contains('Please provide environment variable name').should('be.visible');
                cy.get('.error.message li').should('have.length', 10);

                cy.log('Check allowed characters validations');
                getSegment('Variables').within(() => {
                    cy.get('input[name=variable]').type('$');
                    selectVariableSource('Static');
                    cy.get('td:eq(3) input').type('$');
                });
                getSegment('Environment variables').within(() => {
                    cy.get('input[name=variable]').type('$');
                    selectVariableSource('Static');
                    cy.get('td:eq(3) input').type('$');
                });
                getSegment('Outputs').within(() => {
                    cy.get('input[name=name]').type('$');
                    cy.get('input[name=terraformOutput]').type('$');
                });
                cy.clickButton('Create');
                cy.contains('Errors in the form').scrollIntoView();
                cy.contains('Please provide valid variable key').should('be.visible');
                cy.contains('Please provide valid environment variable key').should('be.visible');
                cy.contains('Please provide valid output name').should('be.visible');
                cy.contains('Please provide valid Terraform output').should('be.visible');
                cy.get('.error.message li').should('have.length', 8);
            });
        });

        it('enable to enter non-existing secret', () => {
            const validVariableName = 'abc';
            const notExistingSecret = `${blueprintNamePrefix}_terraform_secret`;

            const setNotExistingSecret = () => {
                getSegment('Variables').within(() => {
                    cy.get('td:eq(2) input').type(notExistingSecret);
                    cy.get('[role="combobox"] .item').contains(`[new] ${notExistingSecret}`).click();
                });
            };

            openTerraformModal();

            cy.get('.modal').within(() => {
                addFirstSegmentRow('Variables');

                getSegment('Variables').within(() => {
                    cy.get('input[name=variable]').type(validVariableName);
                    selectVariableSource('Secret');
                });

                setNotExistingSecret();
                cy.contains(notExistingSecret);
            });
        });

        it('validate variables and outputs uniqueness', () => {
            openTerraformModal();

            function addDuplicatedNames(segmentName: string, name = 'variable') {
                cy.contains(segmentName)
                    .click()
                    .parent()
                    .within(() => {
                        cy.clickButton('Add').click();
                        cy.get(`input[name=${name}]:eq(0)`).type('name');
                        cy.get(`input[name=${name}]:eq(1)`).type('name');
                    });
            }

            addDuplicatedNames('Variables');
            addDuplicatedNames('Environment variables');
            addDuplicatedNames('Outputs', 'name');

            cy.clickButton('Create');
            cy.contains('Errors in the form').scrollIntoView();
            cy.contains('Variable keys must be unique, duplicates are not allowed').should('be.visible');
            cy.contains('Environment variable keys must be unique, duplicates are not allowed').should('be.visible');
            cy.contains('Outputs must be unique, duplicates are not allowed').should('be.visible');
        });

        it('validate blueprint name uniqueness', () => {
            openTerraformModal();

            const existingBlueprintName = `${blueprintNamePrefix}_existing`;
            cy.uploadBlueprint('blueprints/empty.zip', existingBlueprintName);

            cy.typeToFieldInput('Blueprint name', existingBlueprintName);
            setTemplateDetails(singleModuleTerraformTemplateUrl, 'local');

            cy.clickButton('Create');
            cy.contains('Errors in the form').scrollIntoView();
            cy.contains(`Blueprint '${existingBlueprintName}' already exists`).should('be.visible');
        });

        it('validate blueprint description', () => {
            openTerraformModal();

            cy.typeToFieldInput('Blueprint name', 'not_existing_blueprint_dpeloyment1234');
            typeToTextarea('Blueprint description', 'Invalid string containing non ascii Łódź');
            setTemplateDetails(singleModuleTerraformTemplateUrl, 'local');

            cy.clickButton('Create');
            cy.contains('Errors in the form').scrollIntoView();
            cy.contains(`Please provide valid blueprint description`).should('be.visible');
            typeToTextarea('Blueprint description', 'VALID ASCII STRING. \n!@#$%^&*()[]?\ts');
            cy.contains(`Please provide valid blueprint description`).should('not.be.visible');
        });

        it('validate secret creation on form submission', () => {
            openTerraformModal();

            const blueprintName = `${blueprintNamePrefix}_1212`;
            const secrets = [
                {
                    name: `${blueprintName}_secret1`,
                    value: 'value1'
                },
                {
                    name: `${blueprintName}_secret2`,
                    value: 'value2'
                }
            ];

            cy.deleteSecrets(blueprintName);

            addFirstSegmentRow('Variables');
            getSegment('Variables').within(() => {
                cy.get('input[name=variable]').type('key1');
                selectVariableSource('Secret');
                cy.get('td:eq(2) input').type(`${secrets[0].name}{enter}`);
                cy.get('td:eq(3) input').type(`${secrets[0].value}`);
            });

            addFirstSegmentRow('Environment variables');
            getSegment('Environment variables').within(() => {
                cy.get('input[name=variable]').type('key2');
                selectVariableSource('Secret');
                cy.get('td:eq(2) input').type(`${secrets[1].name}{enter}`);
                cy.get('td:eq(3) input').type(`${secrets[1].value}`);
            });

            cy.typeToFieldInput('Blueprint name', blueprintName);
            setTemplateDetails(singleModuleTerraformTemplateUrl, 'local');

            cy.clickButton('Create');
            cy.contains('Uploading Terraform blueprint').should('be.visible');
            waitUntilNotEmpty(`blueprints?state=uploaded`, { search: blueprintName });

            secrets.forEach(secret => {
                cy.getSecret(secret.name).then(response => {
                    expect(response.body.value).to.equal(secret.value);
                });
            });
        });

        it('handle template URL 401', () => {
            cy.intercept(
                {
                    method: 'POST',
                    pathname: '/console/terraform/resources',
                    query: { templateUrl: singleModuleTerraformTemplateUrl }
                },
                { statusCode: 401 }
            );

            openTerraformModal();

            cy.get('.modal').within(() => {
                cy.get('input[name="terraformUrlOrFileUrl"]').clear().type(singleModuleTerraformTemplateUrl).blur();
                cy.typeToFieldInput('Username', 'username');
                cy.typeToFieldInput('Password', 'password').blur();
                cy.contains('The URL requires authentication');
            });
        });

        describe('handle getting Terraform module from git when', () => {
            const terraformModuleDropdownHasOptions = (hasOptions: boolean) => {
                const optionsAssertion = hasOptions ? 'not.exist' : 'exist';

                cy.contains('Terraform module folder').parent().get(`.dropdown.disabled`).should(optionsAssertion);
            };

            const typeTerraformModuleUrl = (url: string) => {
                cy.get('input[name="terraformUrlOrFileUrl"]').clear().type(url).blur();
            };

            beforeEach(() => {
                openTerraformModal();
            });

            it('providing a correct public git file url', () => {
                const publicGitFileUrl = 'https://github.com/cloudify-community/tf-source.git';

                cy.get('.modal').within(() => {
                    typeTerraformModuleUrl(publicGitFileUrl);
                    terraformModuleDropdownHasOptions(true);
                });
            });

            it('providing an incorrect public git file url', () => {
                const incorrectPublicGitFileUrl = 'https://test.test/test.git';

                cy.get('.modal').within(() => {
                    typeTerraformModuleUrl(incorrectPublicGitFileUrl);
                    terraformModuleDropdownHasOptions(false);

                    cy.get(errorBoxSelector).contains('The URL is not accessible').should('exist');
                });
            });

            it('providing a private git file url without typing corresponding credentials', () => {
                const privateGitFileUrl = 'https://github.com/cloudify-cosmo/cloudify-blueprint-composer.git';

                cy.get('.modal').within(() => {
                    typeTerraformModuleUrl(privateGitFileUrl);
                    terraformModuleDropdownHasOptions(false);

                    cy.get(errorBoxSelector).contains('Git Authentication failed').should('exist');
                });
            });
        });

        it('handle template URL authentication', () => {
            const blueprintName = `${blueprintNamePrefix}_terraform_url_auth`;
            const username = 'username';
            const password = 'password';

            cy.deleteSecrets(blueprintName);

            openTerraformModal();

            cy.get('.modal').within(() => {
                cy.intercept({
                    method: 'POST',
                    pathname: '/console/terraform/resources',
                    query: { templateUrl: singleModuleTerraformTemplateUrl },
                    headers: { Authorization: `Basic dXNlcm5hbWU6cGFzc3dvcmQ=` }
                }).as('resources');

                cy.typeToFieldInput('Blueprint name', blueprintName);

                cy.getField('URL authentication').find('label').click();
                cy.typeToFieldInput('Username', username);
                cy.typeToFieldInput('Password', password);

                cy.get('input[name="terraformUrlOrFileUrl"]').clear().type(singleModuleTerraformTemplateUrl).blur();

                cy.wait('@resources');

                cy.setSingleDropdownValue('Terraform module folder', 'local');
                cy.clickButton('Create');
                cy.contains('Generating Terraform blueprint').should('be.visible');
                cy.contains('Uploading Terraform blueprint').should('be.visible');
            });
            waitUntilNotEmpty(`blueprints?state=uploaded`, { search: blueprintName });

            cy.getSecret(`${blueprintName}.username`).then(response => {
                expect(response.body.value).to.equal(username);
            });
            cy.getSecret(`${blueprintName}.password`).then(response => {
                expect(response.body.value).to.equal(password);
            });
        });

        describe('create installable blueprint on submit from', () => {
            beforeEach(() => {
                cy.mockLogin();
                openTerraformModal();
            });

            function testBlueprintGeneration(terraformTemplateUrl: string, modulePath: string, fromFile = false) {
                const blueprintName = `${blueprintNamePrefix}_terraform_${modulePath}_${fromFile.toString()}`;
                const blueprintDescription = `${blueprintNamePrefix}_terraform_${modulePath}_${fromFile.toString()} Description`;
                const deploymentId = blueprintName;

                cy.contains('Create blueprint from Terraform')
                    .parent('.modal')
                    .within(() => {
                        cy.typeToFieldInput('Blueprint name', blueprintName);
                        typeToTextarea('Blueprint description', blueprintDescription);
                        setTemplateDetails(terraformTemplateUrl, modulePath, fromFile);
                        cy.clickButton('Create');
                        cy.contains('Uploading Terraform blueprint').should('be.visible');
                    });

                waitUntilNotEmpty(`blueprints?state=uploaded`, { search: blueprintName });

                cy.contains('Deploy blueprint')
                    .parent('.modal')
                    .within(() => {
                        cy.typeToFieldInput('Deployment name', deploymentId);
                        cy.openAccordionSection('Advanced');
                        cy.typeToFieldInput('Deployment ID', deploymentId);
                        cy.clickButton('Install');
                    });

                cy.waitForExecutionToEnd('install', { deploymentId }, { numberOfRetriesLeft: 120 });
                cy.getDeployment(deploymentId).then(response => {
                    expect(response.body.latest_execution_status).to.be.equal('completed');
                });
            }

            it('single module template', () => testBlueprintGeneration(singleModuleTerraformTemplateUrl, 'local'));
            it('multiple modules template', () =>
                testBlueprintGeneration(multipleModulesTerraformTemplateUrl, 'local2'));
            it('single module template as a file', () =>
                testBlueprintGeneration(singleModuleTerraformTemplatePath, 'local', true));
            it('multiple modules template as a file', () =>
                testBlueprintGeneration(multipleModulesTerraformTemplatePath, 'local2', true));
        });
    });

    describe('should open Composer', () => {
        before(() => {
            cy.visitTestPage();
            cy.reload();
        });

        it('on "Generate in the Composer" menu item click', () => {
            cy.contains('Upload').click();
            cy.contains('Generate in the Composer').click();

            cy.window().its('open').should('be.calledWith', '/composer/');
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

        it('should allow to add new marketplace tab', () => {
            const testTabMarketplaceName = 'Blueprints from Dagobah';

            cy.editWidgetConfiguration('blueprints', () => {
                cy.get('.marketplaceTabs').contains('Add').click();
                cy.get('input[name="name"]').eq(marketplaceTabs.length).type(testTabMarketplaceName);
                cy.get('input[name="url"]').eq(marketplaceTabs.length).type('https://localhost');
            });
            cy.contains('Upload').click();
            cy.contains('Upload from Marketplace').click();
            cy.contains('.modal', testTabMarketplaceName).should('be.visible');
        });

        it('should allow to rename marketplace tab', () => {
            const testTabMarketplaceName = 'Favorite blueprints';

            cy.editWidgetConfiguration('blueprints', () => {
                cy.get('input[name="name"]')
                    .eq(marketplaceTabs.length - 1)
                    .clear()
                    .type(testTabMarketplaceName);
            });
            cy.contains('Upload').click();
            cy.contains('Upload from Marketplace').click();
            cy.get('.modal').within(() => {
                cy.contains(testTabMarketplaceName).should('be.visible');
            });
        });

        it('should allow to remove marketplace tab', () => {
            cy.editWidgetConfiguration('blueprints', () => {
                cy.get('button[title="Remove"]')
                    .eq(marketplaceTabs.length - 1)
                    .click();
            });
            cy.contains('Upload').click();
            cy.contains('Upload from Marketplace').click();
            cy.get('.modal .tabular > a.item').should('have.length', marketplaceTabs.length - 1);
        });
    });
});
