// @ts-nocheck File not migrated fully to TS
describe('Create Deployment Button widget', () => {
    const resourcePrefix = 'deploy_test_';
    const testBlueprintId = `${resourcePrefix}bp`;
    const requiredSecretsBlueprint = `${resourcePrefix}required_secrets_type`;
    const customInstallWorkflowBlueprint = `${resourcePrefix}custom_install_workflow_type`;
    const customInstallWorkflowParam1 = 'hello';
    const customInstallWorkflowParam2 = 'world';

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentButton').mockLogin();

        cy.deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint('blueprints/simple.zip', testBlueprintId)
            .uploadBlueprint('blueprints/required_secrets.zip', requiredSecretsBlueprint)
            .uploadBlueprint('blueprints/custom_install_workflow.zip', customInstallWorkflowBlueprint);

        const types = ['boolean', 'dict', 'float', 'integer', 'list', 'regex', 'string'];
        types.forEach(type =>
            cy.uploadBlueprint('blueprints/input_types.zip', `${resourcePrefix}${type}_type`, `${type}_type.yaml`)
        );
    });

    beforeEach(() => {
        cy.refreshPage();
        cy.interceptSp('GET', { pathname: '/blueprints', query: { state: 'uploaded' } }).as('uploadedBlueprints');
        cy.get('div.deploymentButtonWidget button').click();
    });

    const checkAttribute = (input, attrName, attrValue) => {
        if (attrValue !== null) {
            expect(input).to.have.attr(attrName, String(attrValue));
        } else {
            expect(input).to.not.have.attr(attrName);
        }
    };

    const verifyTextInput = (value = '') => {
        cy.get('input').then($input => {
            checkAttribute($input, 'value', value);
        });
    };

    const verifyNumberInput = (min = null, max = null, value = '', step = 1) => {
        cy.get('input').then($input => {
            checkAttribute($input, 'min', min);
            checkAttribute($input, 'max', max);
            checkAttribute($input, 'step', step);
            checkAttribute($input, 'value', value);
        });
    };

    const selectBlueprintInModal = type => {
        cy.get('.modal').within(() => {
            const blueprintName = `${resourcePrefix}${type}_type`;
            cy.log(`Selecting blueprint: ${blueprintName}.`);
            cy.setSearchableDropdownValue('Blueprint', blueprintName);

            cy.log('Waiting for blueprint to load and modal to be operational.');
            cy.contains('Deployment Inputs').should('be.visible');
        });
    };

    const waitForDeployBlueprintModal = (install = false) => {
        const deployTimeout = 30000;
        const deployAndInstallTimeout = 40000;

        cy.get('div.deployBlueprintModal div.ui.text.loader').as('loader');
        cy.get('@loader').should('be.visible');
        cy.get('@loader', { timeout: install ? deployAndInstallTimeout : deployTimeout }).should('not.exist');
    };

    const fillDeployBlueprintModal = (deploymentId, deploymentName, blueprintId) => {
        cy.get('div.deployBlueprintModal').within(() => {
            cy.setSearchableDropdownValue('Blueprint', blueprintId);
            cy.get('input[name="deploymentName"]').click().type(deploymentName);
            cy.openAccordionSection('Advanced');
            cy.get('input[name="deploymentId"]').clear().type(deploymentId);

            if (blueprintId === customInstallWorkflowBlueprint) {
                cy.withinAccordionSection('Install', () => {
                    cy.getField('xxx').within(() => {
                        cy.get('textarea').should('have.text', 'blabla').clear().type(customInstallWorkflowParam1);
                    });
                    cy.getField('yyy').within(() => {
                        cy.get('textarea').should('have.text', 'blabla').clear().type(customInstallWorkflowParam2);
                    });
                    cy.getField('Dry run').within(() => cy.get('input[type="checkbox"]').click({ force: true }));
                });
            }

            if (blueprintId === testBlueprintId) {
                cy.withinAccordionSection('Deployment Inputs', () => {
                    // check hidden input is not rendered
                    cy.get('.field')
                        .should('have.length', 1)
                        .should('have.class', 'field')
                        .within(() => {
                            cy.contains('label', 'Server IP');
                            cy.get('textarea').type('127.0.0.1');
                        });
                });
            }
        });
    };

    const deployBlueprint = (deploymentId, deploymentName, install = false, blueprintId = testBlueprintId) => {
        fillDeployBlueprintModal(deploymentId, deploymentName, blueprintId);

        cy.get('div.deployBlueprintModal').within(() => {
            if (install) {
                cy.clickButton('Install');
            } else {
                cy.selectAndClickDeploy();
            }
        });

        waitForDeployBlueprintModal(install);
    };

    const verifyBlueprintDeployed = (blueprintId, deploymentId) => {
        cy.getDeployment(deploymentId).then(response => {
            expect(response.body.id).to.be.equal(deploymentId);
            expect(response.body.blueprint_id).to.be.equal(blueprintId);
        });
    };

    const verifyDeploymentInstallStarted = deploymentId => {
        cy.getExecutions(`deployment_id=${deploymentId}&_sort=-ended_at`).then(response => {
            expect(response.body.items[0].workflow_id).to.be.equal('install');
            expect(response.body.items[0].parameters.xxx).to.be.equal(customInstallWorkflowParam1);
            expect(response.body.items[0].parameters.yyy).to.be.equal(customInstallWorkflowParam2);
            expect(response.body.items[0].is_dry_run).to.be.true;
        });
    };

    const verifyRedirectionToDeploymentPage = (deploymentId, deploymentName) => {
        cy.location('href').then(url =>
            expect(JSON.parse(new URL(url).searchParams.get('c'))[1].context.deploymentId).to.eq(deploymentId)
        );
        cy.get('.breadcrumb .pageTitle').should('have.text', deploymentName);
    };

    it('opens deployment modal', () => {
        cy.wait('@uploadedBlueprints');
        cy.get('div.deployBlueprintModal').should('be.visible');
        cy.get('.actions > .ui:nth-child(1)').should('have.text', 'Cancel');
        cy.get('.actions > .ui:nth-child(2)').within(() => {
            cy.get('button').should('have.text', 'Install');
            cy.contains('.dropdown', 'Install')
                .click() // open dropdown
                .within(() => {
                    cy.get('.item:nth-child(1)').should('have.text', 'Deploy');
                    cy.get('.item:nth-child(2)').should('have.text', 'Install');
                })
                .click(); // close dropdown
        });

        cy.get('.actions > .ui:nth-child(1)').click();
        cy.get('div.deployBlueprintModal').should('not.exist');
    });

    it('allows to deploy a blueprint', () => {
        const deploymentName = `${resourcePrefix}onlyDeploy`;
        const deploymentId = `${deploymentName}Id`;
        deployBlueprint(deploymentId, deploymentName, false);
        verifyRedirectionToDeploymentPage(deploymentId, deploymentName);
        verifyBlueprintDeployed(testBlueprintId, deploymentId);
    });

    it('allows to deploy and install a blueprint', () => {
        const deploymentName = `${resourcePrefix}deployAndInstall`;
        const deploymentId = `${deploymentName}Id`;
        deployBlueprint(deploymentId, deploymentName, true, customInstallWorkflowBlueprint);
        verifyBlueprintDeployed(customInstallWorkflowBlueprint, deploymentId);
        verifyRedirectionToDeploymentPage(deploymentId, deploymentName);
        verifyDeploymentInstallStarted(deploymentId);
    });

    describe('handles errors during deploy & install process', () => {
        afterEach(() => {
            cy.get('.actions > .ui:nth-child(1)').click();
        });

        it('handles data validation errors', () => {
            cy.get('div.deployBlueprintModal').within(() => {
                cy.clickButton('Install');
                cy.get('div.error.message').within(() => {
                    cy.get('li:nth-child(1)').should('have.text', 'Please provide deployment name');
                    cy.get('li:nth-child(2)').should('have.text', 'Please select blueprint from the list');
                });
            });
        });

        it('handles deployment errors', () => {
            const deploymentId = `${resourcePrefix}deployError`;
            fillDeployBlueprintModal(deploymentId, deploymentId, testBlueprintId);

            cy.interceptSp('PUT', `/deployments/${deploymentId}`, {
                statusCode: 400,
                body: {
                    message: 'Cannot deploy blueprint'
                }
            });
            cy.get('div.deployBlueprintModal').clickButton('Install');
            cy.get('div.deployBlueprintModal div.error.message').within(() => {
                cy.get('li:nth-child(1)').should('have.text', 'Cannot deploy blueprint');
            });
        });

        it('handles installation errors', () => {
            const deploymentName = `${resourcePrefix}installError`;
            const deploymentId = `${deploymentName}Id`;
            fillDeployBlueprintModal(deploymentId, deploymentName, testBlueprintId);

            cy.interceptSp('POST', '/executions', {
                statusCode: 400,
                body: {
                    message: 'Cannot start install workflow'
                }
            }).as('installDeployment');

            cy.get('div.deployBlueprintModal').clickButton('Install');
            cy.wait('@installDeployment');

            cy.get('div.deployBlueprintModal div.error.message').within(() => {
                cy.get('li:nth-child(1)').should(
                    'have.text',
                    `Deployment ${deploymentName} installation failed: Cannot start install workflow`
                );
            });
        });

        it('parses constraint error message from /deployments REST API', () => {
            selectBlueprintInModal('string');

            const deploymentName = `${resourcePrefix}constraintError`;
            cy.interceptSp('PUT', `/deployments/${deploymentName}`).as('deployBlueprint');

            cy.typeToFieldInput('Deployment name', deploymentName);
            cy.openAccordionSection('Advanced');
            cy.typeToFieldInput('Deployment ID', deploymentName);
            cy.openAccordionSection('Deployment Inputs');
            cy.get('input[name=string_no_default]').clear().type('Something');

            cy.contains('.field', 'string_constraint_pattern')
                .as('string_constraint_pattern')
                .within(() => {
                    cy.get('input').clear().type('CentOS 7.6').blur();
                });
            cy.get('@string_constraint_pattern').should('not.have.class', 'error');

            cy.selectAndClickDeploy();
            cy.wait('@deployBlueprint');

            cy.get('div.error.message > ul > li').should(
                'contain.text',
                'Value CentOS 7.6 of input string_constraint_pattern violates ' +
                    'constraint pattern(Ubuntu \\d{2}\\.\\d{2}) operator.'
            );
            cy.get('@string_constraint_pattern').should('have.class', 'error');
        });

        it('should handle missing secrets error', () => {
            const secretName = 'test';
            cy.deleteSecrets(secretName);

            selectBlueprintInModal('required_secrets');
            cy.get('.modal').within(() => {
                cy.typeToFieldInput('Deployment name', 'blahBlahBlah');
                cy.selectAndClickDeploy();
                cy.get('.error.message').within(() => {
                    cy.get('.header').should('have.text', 'Missing Secrets Error');
                    cy.get('p').should('have.text', 'The following required secrets are missing in this tenant:');
                    cy.get('.item').should('have.text', secretName);
                });

                cy.contains('button', 'Add Missing Secrets').click();
            });

            cy.get('.secretsModal').within(() => {
                cy.interceptSp('PUT', `/secrets/${secretName}`).as('addSecrets');

                cy.contains('button', 'Add').click();
                cy.get('.error.message').within(() => {
                    cy.get('.header').should('have.text', 'Errors in the form');
                    cy.get('li').should('have.text', 'Please provide values for secrets');
                });

                cy.typeToFieldInput(secretName, 'aaa');
                cy.contains('button', 'Add').click();
                cy.wait('@addSecrets');
            });

            cy.get('.error.message').should('not.exist');
        });

        it('should open the relevant accordion section on error', () => {
            cy.get('div.deployBlueprintModal').within(() => {
                cy.typeToFieldInput('Deployment name', 'aaa');
                cy.openAccordionSection('Advanced');
                cy.getField('Deployment ID').find('input').clear();
                cy.openAccordionSection('Deployment Inputs');
                cy.selectAndClickDeploy();
                cy.getAccordionSection('Advanced').should('have.class', 'active');
                cy.getAccordionSection('Advanced').next('.content').should('have.class', 'active');
                cy.getAccordionSection('Deployment Inputs').should('not.have.class', 'active');
            });
        });
    });

    describe('handles inputs of type', () => {
        afterEach(() => cy.contains('button', 'Cancel').click());

        it('boolean', () => {
            selectBlueprintInModal('boolean');

            cy.contains('.field', 'bool_no_default').within(() => {
                cy.get('div.toggle.checkbox').as('toggle').should('not.have.class', 'checked');
                cy.get('@toggle').should('have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('have.class', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('not.have.class', 'checked');
            });

            cy.contains('.field', 'bool_default_false').within(() => {
                cy.get('div.toggle.checkbox').as('toggle').should('not.have.class', 'checked');
                cy.get('@toggle').should('not.have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('have.class', 'checked');

                cy.revertToDefaultValue();
                cy.get('@toggle').should('not.have.class', 'checked');
            });

            cy.contains('.field', 'bool_default_true').within(() => {
                cy.get('div.toggle.checkbox').as('toggle').should('have.class', 'checked');
                cy.get('@toggle').should('not.have.class', 'indeterminate');
                cy.get('input[type="checkbox"]').should('have.attr', 'checked');

                cy.get('@toggle').click();
                cy.get('@toggle').should('not.have.class', 'checked');

                cy.revertToDefaultValue();
                cy.get('@toggle').should('have.class', 'checked');
            });
        });

        it('integer', () => {
            selectBlueprintInModal('integer');

            cy.contains('.field', 'integer_constraint_max_1').within(() => verifyNumberInput(null, 50));
            cy.contains('.field', 'integer_constraint_max_2').within(() => verifyNumberInput(null, 60));
            cy.contains('.field', 'integer_constraint_max_3').within(() => verifyNumberInput(null, 50));
            cy.contains('.field', 'integer_constraint_max_4').within(() => verifyNumberInput(5, 15));

            cy.contains('.field', 'integer_constraint_min_1').within(() => verifyNumberInput(2));
            cy.contains('.field', 'integer_constraint_min_2').within(() => verifyNumberInput(4));
            cy.contains('.field', 'integer_constraint_min_3').within(() => verifyNumberInput(4));
            cy.contains('.field', 'integer_constraint_min_4').within(() => verifyNumberInput(5, 8));

            cy.contains('.field', 'integer_constraint_min_max').within(() => verifyNumberInput(5, 15, 10));

            cy.contains('.field', 'integer_no_default').within(() => verifyNumberInput());

            cy.contains('.field', 'integer_default').within(() => {
                verifyNumberInput(null, null, 50);

                cy.get('input').as('inputField').clear().type('123').blur();

                verifyNumberInput(null, null, 123);

                cy.revertToDefaultValue();
                verifyNumberInput(null, null, 50);
            });
        });

        it('float', () => {
            selectBlueprintInModal('float');

            cy.contains('.field', 'float_no_default').within(() => verifyNumberInput(null, null, '', 'any'));

            cy.contains('.field', 'float_default').within(() => {
                verifyNumberInput(null, null, 3.14, 'any');

                cy.get('input').as('inputField').clear().type('2.71').blur();

                verifyNumberInput(null, null, 2.71, 'any');

                cy.revertToDefaultValue();
                verifyNumberInput(null, null, 3.14, 'any');
            });
        });

        it('dict', () => {
            selectBlueprintInModal('dict');

            cy.contains('.field', 'dict_no_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should('have.text', '{}0 items');
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link').as('switchIcon').should('be.visible');
                cy.get('.icon.info').as('infoIcon').should('be.visible');

                cy.get('@reactJsonView').trigger('mouseout');
                cy.get('@switchIcon').should('not.exist');
                cy.get('@infoIcon').should('not.exist');

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('@switchIcon').click();
                cy.get('textarea').should('have.text', '{}');
            });

            cy.contains('.field', 'dict_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link').as('switchIcon').click();
                cy.get('textarea').as('rawTextArea').clear().type('{}');
                cy.get('@switchIcon').click();

                cy.get('@reactJsonView').should('have.text', '{}0 items');
                cy.revertToDefaultValue();

                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('@switchIcon').click();
                cy.get('@rawTextArea')
                    .invoke('text')
                    .then(text =>
                        expect(JSON.parse(text)).to.deep.equal({
                            a: 1,
                            b: 3.14,
                            c: [1, 2, 3],
                            d: { e: 1, f: null },
                            g: 'abc'
                        })
                    );
            });
        });

        it('list', () => {
            selectBlueprintInModal('list');

            cy.contains('.field', 'list_no_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should('have.text', '[]0 items');
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit.link').should('be.visible');
                cy.get('.icon.info').should('be.visible');
            });

            cy.contains('.field', 'list_default').within(() => {
                cy.get('div.react-json-view').as('reactJsonView');

                cy.get('@reactJsonView').should(
                    'have.text',
                    '[5 items0:int11:{1 item"a":string"b"}2:string"test"3:[3 items0:int11:int22:int3]4:float3.14]'
                );
                cy.get('@reactJsonView').trigger('mouseover');
                cy.get('.icon.edit').should('have.class', 'link').click();

                cy.get('textarea').clear().type('invalidValue');

                cy.get('.icon.edit').should('have.class', 'disabled');
            });
        });

        it('string', () => {
            selectBlueprintInModal('string');

            cy.contains('.field', 'string_no_default').within(() => {
                verifyTextInput();
            });

            cy.contains('.field', 'string_constraint_pattern').within(() => {
                verifyTextInput('Ubuntu 18.04');
                cy.get('input').clear().type('Something').blur();
                verifyTextInput('Something');
                cy.revertToDefaultValue();
                verifyTextInput('Ubuntu 18.04');
            });

            cy.contains('.field', 'string_constraint_valid_values').within(() => {
                cy.get('div.text').as('text').should('have.text', 'en');
                cy.get('div.dropdown').click();

                cy.get('div[name="pl"]').should('be.visible');
                cy.get('div[name="en"]').should('be.visible');
                cy.get('div[name="fr"]').should('be.visible');
                cy.get('div[name="pl"]').click();
                cy.get('@text').should('have.text', 'pl');

                cy.revertToDefaultValue();
                cy.get('@text').should('have.text', 'en');

                cy.get('i.dropdown.icon').as('dropdownOrClearIcon').should('be.visible').should('have.class', 'clear');
                cy.get('@dropdownOrClearIcon').click();

                cy.get('@text').should('not.exist');
                cy.get('@dropdownOrClearIcon').should('not.have.class', 'clear');

                cy.revertToDefaultValue();
                cy.get('@text').should('have.text', 'en');
            });

            cy.contains('.field', 'string_default').within(() => {
                verifyTextInput('Some default string');
            });

            cy.contains('.field', 'string_default_null').within(() => {
                verifyTextInput('null');
            });
        });
    });
});
