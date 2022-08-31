describe('Create Deployment Button widget', () => {
    const resourcePrefix = 'deploy_test_';
    const testBlueprintId = `${resourcePrefix}bp`;
    const requiredSecretsBlueprint = `${resourcePrefix}required_secrets_type`;
    const customInstallWorkflowBlueprint = `${resourcePrefix}custom_install_workflow_type`;
    const customInstallWorkflowParam1 = 'hello';
    const customInstallWorkflowParam2 = 'world';

    const types = ['string'];

    before(() => {
        cy.activate('valid_trial_license').usePageMock('deploymentButton').mockLogin();
        cy.deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint('blueprints/simple.zip', testBlueprintId)
            .uploadBlueprint('blueprints/required_secrets.zip', requiredSecretsBlueprint)
            .uploadBlueprint('blueprints/custom_install_workflow.zip', customInstallWorkflowBlueprint);

        types.forEach(type =>
            cy.uploadBlueprint('blueprints/input_types.zip', `${resourcePrefix}${type}_type`, {
                yamlFile: `${type}_type.yaml`
            })
        );
    });

    beforeEach(() => {
        cy.refreshPage();
        cy.interceptSp('POST', { pathname: '/searches/blueprints', query: { state: 'uploaded' } }).as(
            'uploadedBlueprints'
        );
        cy.get('div.deploymentButtonWidget button').click();
    });

    const selectBlueprintInModal = (type: string) => {
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

    const fillDeployBlueprintModal = (deploymentId: string, deploymentName: string, blueprintId: string) => {
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

    const deployBlueprint = (
        deploymentId: string,
        deploymentName: string,
        install = false,
        blueprintId = testBlueprintId
    ) => {
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

    const verifyBlueprintDeployed = (blueprintId: string, deploymentId: string) => {
        cy.getDeployment(deploymentId).then(response => {
            expect(response.body.id).to.be.equal(deploymentId);
            expect(response.body.blueprint_id).to.be.equal(blueprintId);
        });
    };

    const verifyDeploymentInstallStarted = (deploymentId: string) => {
        cy.getExecutions(`deployment_id=${deploymentId}&_sort=-ended_at`).then(response => {
            expect(response.body.items[0].workflow_id).to.be.equal('install');
            expect(response.body.items[0].parameters.xxx).to.be.equal(customInstallWorkflowParam1);
            expect(response.body.items[0].parameters.yyy).to.be.equal(customInstallWorkflowParam2);
            expect(response.body.items[0].is_dry_run).to.be.true;
        });
    };

    const verifyRedirectionToDeploymentPage = (deploymentId: string, deploymentName: string) => {
        cy.get('.breadcrumb .pageTitle').should('have.text', deploymentName);
        cy.location('href').then(url =>
            expect(JSON.parse(new URL(url).searchParams.get('c')!)[1].context.deploymentId).to.eq(deploymentId)
        );
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

            cy.getField('string_constraint_pattern')
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
            const secretNames = [`${resourcePrefix}secret`, `${resourcePrefix}secret_multiline`];
            const secretValue = 'aaa';

            cy.deleteSecrets(resourcePrefix);

            selectBlueprintInModal('required_secrets');
            cy.get('.modal').within(() => {
                cy.typeToFieldInput('Deployment name', 'blahBlahBlah');
                cy.selectAndClickDeploy();
                cy.get('.error.message').within(() => {
                    cy.get('.header').should('have.text', 'Missing Secrets Error');
                    cy.get('p').should('have.text', 'The following required secrets are missing in this tenant:');
                    secretNames.forEach(secretName => {
                        cy.contains('.item', secretName);
                    });
                });
                cy.contains('button', 'Add Missing Secrets').click();
            });

            cy.get('.secretsModal').within(() => {
                secretNames.forEach(secretName => cy.interceptSp('PUT', `/secrets/${secretName}`).as(secretName));

                cy.contains('button', 'Add').click();
                cy.get('.error.message').within(() => {
                    cy.get('.header').should('have.text', 'Errors in the form');
                    cy.get('li').should('have.text', 'Please provide values for secrets');
                });
                secretNames.forEach(secretName => cy.get(`input[name=${secretName}]`).type(secretValue));

                cy.contains('secret_multiline').siblings('.fields').find('.checkbox').click();
                cy.get(`textarea[name="${secretNames[1]}"]`).should('be.visible').should('have.value', secretValue);
                cy.contains('button', 'Add').click();
            });

            cy.get('.error.message').should('not.exist');
            cy.wait(secretNames.map(secretName => `@${secretName}`));
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
});
