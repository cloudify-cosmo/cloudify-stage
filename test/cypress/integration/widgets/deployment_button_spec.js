describe('Create Deployment Button widget', () => {
    const resourcePrefix = 'deploy_test_';
    const testBlueprintId = `${resourcePrefix}bp`;
    const testBlueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/simple-hello-world-example.zip';
    const firstInputNthChild = 7;

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentButton').mockLogin();

        cy.deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint(testBlueprintUrl, testBlueprintId);

        const types = ['boolean', 'dict', 'float', 'integer', 'list', 'regex', 'string'];
        types.forEach(type =>
            cy.uploadBlueprint('blueprints/input_types.zip', `${resourcePrefix}${type}_type`, `${type}_type.yaml`)
        );
    });

    beforeEach(() => {
        cy.refreshPage();
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
        const blueprintName = `${resourcePrefix}${type}_type`;
        cy.log(`Selecting blueprint: ${blueprintName}.`);
        cy.get('.modal form div[name="blueprintName"]')
            .click()
            .within(() => {
                cy.get('input').type(`${blueprintName}`);
                cy.get(`div[option-value="${blueprintName}"]`).click();
            });
        cy.log('Waiting for blueprint to load and modal to be operational.');
        cy.contains('Deployment inputs').should('be.visible');
    };

    const waitForDeployBlueprintModal = (install = false) => {
        const deployTimeout = 30000;
        const deployAndInstallTimeout = 40000;

        cy.get('div.deployBlueprintModal div.ui.text.loader').as('loader');
        cy.get('@loader').should('be.visible');
        cy.get('@loader', { timeout: install ? deployAndInstallTimeout : deployTimeout }).should('not.be.visible');
    };

    const fillDeployBlueprintModal = (deploymentName, blueprintId) => {
        cy.get('div.deployBlueprintModal').within(() => {
            cy.get('div[name="blueprintName"]')
                .click()
                .within(() => {
                    cy.get('input').type(resourcePrefix);
                    cy.get(`div[option-value=${blueprintId}]`).click();
                });

            cy.get('input[name="deploymentName"]').click().type(deploymentName);
        });
    };

    const deployBlueprint = (deploymentName, install = false) => {
        fillDeployBlueprintModal(deploymentName, testBlueprintId);

        cy.get(`div.deployBlueprintModal .actions > .ui:nth-child(${install ? '3' : '2'})`).click();

        if (install) {
            cy.get('div.executeWorkflowModal .actions > .ui:nth-child(2)').click();
        }

        waitForDeployBlueprintModal(install);
    };

    const verifyBlueprintDeployed = (blueprintId, deploymentName) => {
        cy.getDeployment(deploymentName).then(response => {
            expect(response.body.id).to.be.equal(deploymentName);
            expect(response.body.blueprint_id).to.be.equal(blueprintId);
        });
    };

    const verifyDeploymentInstallStarted = deploymentName => {
        cy.getExecutions(`deployment_id=${deploymentName}&_sort=-ended_at`).then(response => {
            expect(response.body.items[0].workflow_id).to.be.equal('install');
        });
    };

    const verifyRedirectionToDeploymentPage = deploymentName => {
        cy.location('pathname').should('have.string', `deployment/${deploymentName}`);
        cy.get('.breadcrumb .pageTitle').should('have.text', deploymentName);
    };

    it('opens deployment modal', () => {
        cy.get('div.deployBlueprintModal').should('be.visible');
        cy.get('.actions > .ui:nth-child(1)').should('have.text', 'Cancel');
        cy.get('.actions > .ui:nth-child(2)').should('have.text', 'Deploy');
        cy.get('.actions > .ui:nth-child(3)').should('have.text', 'Deploy & Install');

        cy.get('.actions > .ui:nth-child(1)').click();
        cy.get('div.deployBlueprintModal').should('not.be.visible');
    });

    it('allows to deploy a blueprint', () => {
        const deploymentNameWithoutInstall = `${resourcePrefix}onlyDeploy`;
        deployBlueprint(deploymentNameWithoutInstall, false);
        verifyRedirectionToDeploymentPage(deploymentNameWithoutInstall);
        verifyBlueprintDeployed(testBlueprintId, deploymentNameWithoutInstall);
    });

    it('allows to deploy and install a blueprint', () => {
        const deploymentNameWithInstall = `${resourcePrefix}deployAndInstall`;
        deployBlueprint(deploymentNameWithInstall, true);
        verifyBlueprintDeployed(testBlueprintId, deploymentNameWithInstall);
        verifyRedirectionToDeploymentPage(deploymentNameWithInstall);
        verifyDeploymentInstallStarted(deploymentNameWithInstall);
    });

    describe('handles errors during deploy & install process', () => {
        beforeEach(() => {
            cy.server();
        });

        afterEach(() => {
            cy.server({ enable: false });
            cy.get(`.actions > .ui:nth-child(1)`).click();
        });

        it('handles data validation errors', () => {
            cy.get('div.deployBlueprintModal').within(() => {
                cy.get(`.actions > .ui:nth-child(3)`).click();
                cy.get('div.error.message').within(() => {
                    cy.get('li:nth-child(1)').should('have.text', 'Please select blueprint from the list');
                    cy.get('li:nth-child(2)').should('have.text', 'Please provide deployment name');
                });
            });
        });

        it('handles deployment errors', () => {
            const deploymentName = `${resourcePrefix}deployError`;
            fillDeployBlueprintModal(deploymentName, testBlueprintId);

            cy.route({
                method: 'PUT',
                url: `console/sp?su=/deployments/${deploymentName}`,
                status: 400,
                response: {
                    message: 'Cannot deploy blueprint'
                }
            });
            cy.get(`div.deployBlueprintModal .actions > .ui:nth-child(3)`).click();
            cy.get('div.executeWorkflowModal .actions > .ui:nth-child(2)').click();
            cy.get('div.deployBlueprintModal div.error.message').within(() => {
                cy.get('li:nth-child(1)').should('have.text', 'Cannot deploy blueprint');
            });
        });

        it('handles installation errors', () => {
            const deploymentName = `${resourcePrefix}installError`;
            fillDeployBlueprintModal(deploymentName, testBlueprintId);

            cy.route({
                method: 'POST',
                url: '/console/sp?su=/executions',
                status: 400,
                response: {
                    message: 'Cannot start install workflow'
                }
            }).as('installDeployment');

            cy.get(`div.deployBlueprintModal .actions > .ui:nth-child(3)`).click();
            cy.get('div.executeWorkflowModal .actions > .ui:nth-child(2)').click();
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

            const deploymentName = 'test';

            cy.route({
                method: 'PUT',
                url: `/console/sp?su=/deployments/${deploymentName}`
            }).as('deployBlueprint');

            cy.get('input[name="deploymentName"]').type(deploymentName);
            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('string_no_default')
                .within(() => {
                    cy.get('input').clear().type('Something');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('string_constraint_pattern')
                .within(() => {
                    cy.get('input').clear().type('CentOS 7.6').blur();
                });
            cy.get('string_constraint_pattern').should('not.have.class', 'error');

            cy.get(`.actions > .ui:nth-child(2)`).click();
            cy.wait('@deployBlueprint');

            cy.get('div.error.message > ul > li').should(
                'have.text',
                'Value CentOS 7.6 of input string_constraint_pattern violates ' +
                    'constraint pattern(Ubuntu \\d{2}\\.\\d{2}) operator.'
            );
            cy.get('@string_constraint_pattern').should('have.class', 'error');
        });
    });

    describe('handles inputs of type', () => {
        afterEach(() => cy.get(`.actions > .ui:nth-child(1)`).click());

        it('boolean', () => {
            selectBlueprintInModal('boolean');

            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('boolean_no_default')
                .within(() => {
                    cy.get('div.toggle.checkbox').as('toggle').should('not.have.class', 'checked');
                    cy.get('@toggle').should('have.class', 'indeterminate');
                    cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                    cy.get('@toggle').click();
                    cy.get('@toggle').should('have.class', 'checked');

                    cy.get('@toggle').click();
                    cy.get('@toggle').should('not.have.class', 'checked');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('boolean_default_false')
                .within(() => {
                    cy.get('div.toggle.checkbox').as('toggle').should('not.have.class', 'checked');
                    cy.get('@toggle').should('not.have.class', 'indeterminate');
                    cy.get('input[type="checkbox"]').should('not.have.attr', 'checked');

                    cy.get('@toggle').click();
                    cy.get('i.undo.link.icon').as('revertToDefaultValue').should('be.visible');
                    cy.get('@toggle').should('have.class', 'checked');

                    cy.get('@revertToDefaultValue').click();
                    cy.get('@revertToDefaultValue').should('not.be.visible');
                    cy.get('@toggle').should('not.have.class', 'checked');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 2}).field`)
                .as('boolean_default_true')
                .within(() => {
                    cy.get('div.toggle.checkbox').as('toggle').should('have.class', 'checked');
                    cy.get('@toggle').should('not.have.class', 'indeterminate');
                    cy.get('input[type="checkbox"]').should('have.attr', 'checked');

                    cy.get('@toggle').click();
                    cy.get('i.undo.link.icon').as('revertToDefaultValue').should('be.visible');
                    cy.get('@toggle').should('not.have.class', 'checked');

                    cy.get('@revertToDefaultValue').click();
                    cy.get('@revertToDefaultValue').should('not.be.visible');
                    cy.get('@toggle').should('have.class', 'checked');
                });
        });

        it('integer', () => {
            selectBlueprintInModal('integer');

            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('integer_constraint_max_1')
                .within(() => verifyNumberInput(null, 50));
            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('integer_constraint_max_2')
                .within(() => verifyNumberInput(null, 60));
            cy.get(`form :nth-child(${firstInputNthChild + 2}).field`)
                .as('integer_constraint_max_3')
                .within(() => verifyNumberInput(null, 50));
            cy.get(`form :nth-child(${firstInputNthChild + 3}).field`)
                .as('integer_constraint_max_4')
                .within(() => verifyNumberInput(5, 15));

            cy.get(`form :nth-child(${firstInputNthChild + 4}).field`)
                .as('integer_constraint_min_1')
                .within(() => verifyNumberInput(2));
            cy.get(`form :nth-child(${firstInputNthChild + 5}).field`)
                .as('integer_constraint_min_2')
                .within(() => verifyNumberInput(4));
            cy.get(`form :nth-child(${firstInputNthChild + 6}).field`)
                .as('integer_constraint_min_3')
                .within(() => verifyNumberInput(4));
            cy.get(`form :nth-child(${firstInputNthChild + 7}).field`)
                .as('integer_constraint_min_4')
                .within(() => verifyNumberInput(5, 8));

            cy.get(`form :nth-child(${firstInputNthChild + 9}).field`)
                .as('integer_constraint_min_max')
                .within(() => verifyNumberInput(5, 15, 10));

            cy.get(`form :nth-child(${firstInputNthChild + 8}).field`)
                .as('integer_no_default')
                .within(() => verifyNumberInput());

            cy.get(`form :nth-child(${firstInputNthChild + 10}).field`)
                .as('integer_default')
                .within(() => {
                    verifyNumberInput(null, null, 50);

                    cy.get('input').as('inputField').clear().type('123').blur();

                    verifyNumberInput(null, null, 123);
                    cy.get('i.undo.link.icon').as('revertToDefaultValue').should('be.visible');

                    cy.get('@revertToDefaultValue').click();
                    verifyNumberInput(null, null, 50);
                    cy.get('@revertToDefaultValue').should('not.be.visible');
                });
        });

        it('float', () => {
            selectBlueprintInModal('float');

            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('float_no_default')
                .within(() => verifyNumberInput(null, null, '', 'any'));

            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('float_default')
                .within(() => {
                    verifyNumberInput(null, null, 3.14, 'any');

                    cy.get('input').as('inputField').clear().type('2.71').blur();

                    verifyNumberInput(null, null, 2.71, 'any');
                    cy.get('i.undo.link.icon').as('revertToDefaultValue').should('be.visible');

                    cy.get('@revertToDefaultValue').click();
                    verifyNumberInput(null, null, 3.14, 'any');
                    cy.get('@revertToDefaultValue').should('not.be.visible');
                });
        });

        it('dict', () => {
            selectBlueprintInModal('dict');

            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('dict_no_default')
                .within(() => {
                    cy.get('div.react-json-view').as('reactJsonView');

                    cy.get('@reactJsonView').should('have.text', '{}0 items');
                    cy.get('@reactJsonView').trigger('mouseover');
                    cy.get('.icon.edit.link').as('switchIcon').should('be.visible');
                    cy.get('.icon.info').as('infoIcon').should('be.visible');

                    cy.get('@reactJsonView').trigger('mouseout');
                    cy.get('@switchIcon').should('not.be.visible');
                    cy.get('@infoIcon').should('not.be.visible');

                    cy.get('@reactJsonView').trigger('mouseover');
                    cy.get('@switchIcon').click();
                    cy.get('textarea').should('have.text', '{}');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('dict_default')
                .within(() => {
                    cy.get('div.react-json-view').as('reactJsonView');

                    cy.get('@reactJsonView').trigger('mouseover');
                    cy.get('.icon.edit.link').as('switchIcon').click();
                    cy.get('textarea').as('rawTextArea').clear().type('{}');
                    cy.get('@switchIcon').click();

                    cy.get('@reactJsonView').should('have.text', '{}0 items');
                    cy.get('.icon.undo.link').as('revertToDefaultIcon').click();

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

            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('list_no_default')
                .within(() => {
                    cy.get('div.react-json-view').as('reactJsonView');

                    cy.get('@reactJsonView').should('have.text', '[]0 items');
                    cy.get('@reactJsonView').trigger('mouseover');
                    cy.get('.icon.edit.link').as('switchIcon').should('be.visible');
                    cy.get('.icon.info').as('infoIcon').should('be.visible');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('list_default')
                .within(() => {
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

            cy.get(`form :nth-child(${firstInputNthChild}).field`)
                .as('string_no_default')
                .within(() => {
                    verifyTextInput();
                });

            cy.get(`form :nth-child(${firstInputNthChild + 1}).field`)
                .as('string_constraint_pattern')
                .within(() => {
                    verifyTextInput('Ubuntu 18.04');
                    cy.get('input').clear().type('Something').blur();
                    verifyTextInput('Something');
                    cy.get('i.undo.link.icon').as('revertToDefaultValue').should('be.visible');
                    cy.get('@revertToDefaultValue').click();
                    cy.get('@revertToDefaultValue').should('not.be.visible');
                    verifyTextInput('Ubuntu 18.04');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 2}).field`)
                .as('string_constraint_valid_values')
                .within(() => {
                    cy.get('div.text').as('text').should('have.text', 'en');
                    cy.get('div.dropdown').click();

                    cy.get('div[name="pl"]').should('be.visible');
                    cy.get('div[name="en"]').should('be.visible');
                    cy.get('div[name="fr"]').should('be.visible');
                    cy.get('div[name="pl"]').click();
                    cy.get('@text').should('have.text', 'pl');

                    cy.get('i.undo.link.icon').as('revertToDefaultValue').should('be.visible');
                    cy.get('@revertToDefaultValue').click();

                    cy.get('@revertToDefaultValue').should('not.be.visible');
                    cy.get('@text').should('have.text', 'en');

                    cy.get('i.dropdown.icon')
                        .as('dropdownOrClearIcon')
                        .should('be.visible')
                        .should('have.class', 'clear');
                    cy.get('@dropdownOrClearIcon').click();

                    cy.get('@text').should('not.be.visible');
                    cy.get('@revertToDefaultValue').should('be.visible');
                    cy.get('@dropdownOrClearIcon').should('not.have.class', 'clear');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 3}).field`)
                .as('string_default')
                .within(() => {
                    verifyTextInput('Some default string');
                });

            cy.get(`form :nth-child(${firstInputNthChild + 4}).field`)
                .as('string_default_null')
                .within(() => {
                    verifyTextInput('null');
                });
        });
    });
});
