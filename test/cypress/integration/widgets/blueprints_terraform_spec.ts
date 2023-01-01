import type { BlueprintsWidgetConfiguration } from '../../../../widgets/blueprints/src/types';

describe('Blueprints widget should open upload from Terraform module modal and', () => {
    const blueprintNamePrefix = 'blueprints_test';
    const blueprintsWidgetConfiguration: Partial<BlueprintsWidgetConfiguration> = {
        displayStyle: 'table',
        clickToDrillDown: true,
        pollingTime: 5,
        showComposerOptions: true,
        filterRules: []
    };
    const terraformTemplatesBaseUrl =
        'https://github.com/cloudify-cosmo/cloudify-stage/raw/master/test/cypress/fixtures/terraform/';
    const singleModuleTerraformTemplateUrl = `${terraformTemplatesBaseUrl}single.zip`;
    const multipleModulesTerraformTemplateUrl = `${terraformTemplatesBaseUrl}multiple.zip`;
    const singleModuleTerraformTemplatePath = `terraform/single.zip`;
    const multipleModulesTerraformTemplatePath = 'terraform/multiple.zip';
    const variablesAndOutputsModulesTerraformTemplatePath = 'terraform/variables-and-outputs.zip';

    before(() =>
        cy
            .activate('valid_trial_license')
            .deleteDeployments(blueprintNamePrefix, true)
            .deleteBlueprints(blueprintNamePrefix, true)
            .deletePlugins()
            .usePageMock('blueprints', blueprintsWidgetConfiguration)
            .mockLogin()
    );

    beforeEach(() => cy.refreshTemplate().refreshPage());

    function typeToTextarea(fieldName: string, text: string) {
        cy.getField(fieldName).find('textarea').clear().type(text);
    }

    function openTerraformModal() {
        cy.contains('Upload').click();
        cy.contains('Upload from Terraform module').click();
    }

    function setTemplateDetails(template: string, modulePath?: string, fromFile = false) {
        if (fromFile) {
            cy.get('input[name=terraformUrlOrFileFile]').attachFile(template);
        } else {
            cy.get('input[name="terraformUrlOrFileUrl"]').clear().type(template).blur();
        }
        if (modulePath) {
            cy.setSingleDropdownValue('Terraform module folder', modulePath);
        }
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
            cy.contains('Please provide blueprint name').scrollIntoView().should('be.visible');
            cy.contains('Please provide Terraform template').should('be.visible');
            cy.contains('Please provide resource location').scrollIntoView().should('be.visible');
            cy.contains('Please provide variable key').scrollIntoView().should('be.visible');
            cy.contains('Please provide variable source').should('be.visible');
            cy.contains('Please provide environment variable key').scrollIntoView().should('be.visible');
            cy.contains('Please provide environment variable source').should('be.visible');
            cy.contains('Please provide output name').scrollIntoView().should('be.visible');
            cy.contains('Please provide output type').should('be.visible');
            cy.contains('Please provide Terraform output').should('be.visible');

            getSegment('Variables').within(() => {
                selectVariableSource('Secret');
            });
            getSegment('Environment variables').within(() => {
                selectVariableSource('Secret');
            });
            cy.clickButton('Create');
            cy.contains('Please provide variable name').scrollIntoView().should('be.visible');
            cy.contains('Please provide environment variable name').should('be.visible');

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
            cy.contains('Please provide valid variable key').scrollIntoView().should('be.visible');
            cy.contains('Please provide valid environment variable key').scrollIntoView().should('be.visible');
            cy.contains('Please provide valid output name').scrollIntoView().should('be.visible');
            cy.contains('Please provide valid Terraform output').should('be.visible');
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
        cy.contains('Variable keys must be unique, duplicates are not allowed').scrollIntoView().should('be.visible');
        cy.contains('Environment variable keys must be unique, duplicates are not allowed')
            .scrollIntoView()
            .should('be.visible');
        cy.contains('Outputs must be unique, duplicates are not allowed').scrollIntoView().should('be.visible');
    });

    it('validate blueprint name uniqueness', () => {
        openTerraformModal();

        const existingBlueprintName = `${blueprintNamePrefix}_existing`;
        cy.uploadBlueprint('blueprints/empty.zip', existingBlueprintName);

        cy.typeToFieldInput('Blueprint name', existingBlueprintName);
        setTemplateDetails(singleModuleTerraformTemplateUrl, 'local');

        cy.clickButton('Create');
        cy.contains(`Blueprint '${existingBlueprintName}' already exists`).scrollIntoView().should('be.visible');
    });

    it('validate blueprint description', () => {
        openTerraformModal();

        typeToTextarea('Blueprint description', 'Invalid string containing non ascii Łódź');

        cy.clickButton('Create');
        cy.contains('Blueprint description').scrollIntoView();
        cy.contains(`Please provide valid blueprint description`).should('be.visible');
        typeToTextarea('Blueprint description', 'VALID ASCII STRING. \n!@#$%^&*()[]?\ts');
        cy.clickButton('Create');
        cy.contains('Blueprint description').scrollIntoView();
        cy.contains(`Please provide valid blueprint description`).should('not.exist');
    });

    it('validate outputs and inputs auto-import', () => {
        const expectedVariables = 7;
        const expectedOutputs = 2;
        openTerraformModal();
        cy.typeToFieldInput('Blueprint name', 'not_existing_blueprint_outputs_inputs_test');
        setTemplateDetails(variablesAndOutputsModulesTerraformTemplatePath, undefined, true);
        cy.contains(`- ${expectedVariables} Variables`).should('be.visible');
        cy.contains(`- ${expectedOutputs} Outputs`).should('be.visible');
        cy.contains('.modal .button', 'Yes').click();
        cy.contains('.segment', 'Variables').click();
        cy.contains('.segment', 'Outputs').click();

        cy.get('.segment .content.active table > tbody > tr').should(
            'have.length',
            expectedVariables + expectedOutputs
        );
    });

    it('allow to use new or existing secret as variable source', () => {
        openTerraformModal();

        const blueprintName = `${blueprintNamePrefix}_1212`;
        const secret1Key = `${blueprintName}_secret1`;
        const secret1Value = 'value1';
        const secret2Key = `${blueprintName}_secret2`;
        const secret2Value = 'value2';

        cy.deleteSecrets(blueprintName);
        cy.createSecret(secret2Key, secret2Value);

        addFirstSegmentRow('Variables');
        getSegment('Variables').within(() => {
            cy.get('input[name=variable]').type('key1');
            selectVariableSource('Secret');
            cy.get('td:eq(2) input').type(`${secret1Key}{enter}`);
            cy.get('td:eq(3) input').type(`${secret1Value}`);
        });

        addFirstSegmentRow('Environment variables');
        getSegment('Environment variables').within(() => {
            cy.get('input[name=variable]').type('key2');
            selectVariableSource('Secret');
            cy.get('td:eq(2) input').type(`${secret2Key}{enter}`);
            cy.get('td:eq(3) input').should('be.disabled');
        });

        cy.typeToFieldInput('Blueprint name', blueprintName);
        setTemplateDetails(singleModuleTerraformTemplateUrl, 'local');

        cy.clickButton('Create');
        cy.contains('Uploading Terraform blueprint').should('be.visible');
        cy.waitUntilNotEmpty(`blueprints?state=uploaded`, { search: blueprintName });

        cy.getSecret(secret1Key).then(response => {
            expect(response.body.value).to.equal(secret1Value);
        });

        cy.contains('.modal', 'Deploy blueprint');
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
        const verifyTerraformModuleDropdownInitialized = (hasOptions: boolean) => {
            cy.getField('Terraform module folder').within(() => {
                cy.get('.dropdown.disabled').should(hasOptions ? 'not.exist' : 'exist');
                cy.get('.selection > .text').should(hasOptions ? 'be.visible' : 'not.exist');
            });
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
                verifyTerraformModuleDropdownInitialized(true);
            });
        });

        it('providing an incorrect public git file url', () => {
            const incorrectPublicGitFileUrl = 'https://test.test/test.git';

            cy.get('.modal').within(() => {
                typeTerraformModuleUrl(incorrectPublicGitFileUrl);
                verifyTerraformModuleDropdownInitialized(false);

                cy.contains('The URL is not accessible').should('exist');
            });
        });

        it('providing a private git file url without typing corresponding credentials', () => {
            const privateGitFileUrl = 'https://github.com/cloudify-cosmo/cloudify-blueprint-composer.git';

            cy.get('.modal').within(() => {
                typeTerraformModuleUrl(privateGitFileUrl);
                verifyTerraformModuleDropdownInitialized(false);

                cy.contains('Git Authentication failed').should('exist');
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
        cy.waitUntilNotEmpty(`blueprints?state=uploaded`, { search: blueprintName });

        cy.getSecret(`${blueprintName}.username`).then(response => {
            expect(response.body.value).to.equal(username);
        });
        cy.getSecret(`${blueprintName}.password`).then(response => {
            expect(response.body.value).to.equal(password);
        });

        cy.contains('.modal', 'Deploy blueprint');
    });

    describe('create installable blueprint on submit from', () => {
        beforeEach(() => {
            cy.mockLogin();
            openTerraformModal();
        });

        function testBlueprintGeneration(terraformTemplateUrl: string, modulePath: string, fromFile = false) {
            const blueprintName = `${blueprintNamePrefix}_terraform_${modulePath}_${fromFile}`;
            const blueprintDescription = `${blueprintNamePrefix}_terraform_${modulePath}_${fromFile} Description`;
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

            cy.waitUntilNotEmpty(`blueprints?state=uploaded`, { search: blueprintName });

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
        it('multiple modules template', () => testBlueprintGeneration(multipleModulesTerraformTemplateUrl, 'local2'));
        it('single module template as a file', () =>
            testBlueprintGeneration(singleModuleTerraformTemplatePath, 'local', true));
        it('multiple modules template as a file', () =>
            testBlueprintGeneration(multipleModulesTerraformTemplatePath, 'local2', true));
    });
});
