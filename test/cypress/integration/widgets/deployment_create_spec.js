describe('Deployments - Create new deployment modal', () => {
    const resourcePrefix = 'deploy_test_';
    const testBlueprintId = `${resourcePrefix}bp`;
    const testBlueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/latest/simple-hello-world-example.zip';

    const searchTestBlueprintsInBlueprintsWidget = () => {
        cy.server();
        cy.route(/console\/sp\?su=\/summary/).as('getSummary');
        cy.route(/console\/sp\?su=\/blueprints/).as('getBlueprints');
        cy.get('.blueprintsTable div.input input').clear().type(resourcePrefix).blur();
        cy.wait('@getBlueprints');
        cy.wait('@getSummary');
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

    const verifyDeployBlueprintModal = () => {
        cy.get('div.deployBlueprintModal').should('be.visible');
        cy.get('.actions > .ui:nth-child(1)').should('have.text', 'Cancel');
        cy.get('.actions > .ui:nth-child(2)').should('have.text', 'Deploy');
        cy.get('.actions > .ui:nth-child(3)').should('have.text', 'Deploy & Install');

        cy.get('.actions > .ui:nth-child(1)').click();
        cy.get('div.deployBlueprintModal').should('not.be.visible');
    };

    before(() => {
        cy.activate('valid_trial_license').login();

        cy.deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint(testBlueprintUrl, testBlueprintId);
    });

    it('is available in Dashboard page in Create Deployment Button widget ', () => {
        cy.visitPage('Dashboard');
        cy.get('div.deploymentButtonWidget button').click();

        verifyDeployBlueprintModal();
    });

    it('is available in Blueprint page in Blueprint Action Buttons widget', () => {
        cy.visitPage('Local Blueprints');
        searchTestBlueprintsInBlueprintsWidget();
        cy.get(`tr#blueprintsTable_${testBlueprintId} td a`).click();
        cy.get('button#createDeploymentButton').click();

        verifyDeployBlueprintModal();
    });

    it('is available in Local Blueprints page in Blueprints widget', () => {
        cy.visitPage('Local Blueprints');
        searchTestBlueprintsInBlueprintsWidget();
        cy.get(`tr#blueprintsTable_${testBlueprintId} i.icon.link.rocket`).click();

        verifyDeployBlueprintModal();
    });

    it('allows to deploy a blueprint', () => {
        cy.visitPage('Dashboard');
        cy.get('div.deploymentButtonWidget button').click();
        const deploymentNameWithoutInstall = `${resourcePrefix}onlyDeploy`;
        deployBlueprint(deploymentNameWithoutInstall, false);
        verifyRedirectionToDeploymentPage(deploymentNameWithoutInstall);
        verifyBlueprintDeployed(testBlueprintId, deploymentNameWithoutInstall);
    });

    it('allows to deploy and install a blueprint', () => {
        cy.visitPage('Dashboard');
        cy.get('div.deploymentButtonWidget button').click();
        const deploymentNameWithInstall = `${resourcePrefix}deployAndInstall`;
        deployBlueprint(deploymentNameWithInstall, true);
        verifyBlueprintDeployed(testBlueprintId, deploymentNameWithInstall);
        verifyRedirectionToDeploymentPage(deploymentNameWithInstall);
        verifyDeploymentInstallStarted(deploymentNameWithInstall);
    });

    describe('handles errors during deploy & install process', () => {
        before(() => {
            cy.visitPage('Dashboard');
        });

        beforeEach(() => {
            cy.get('div.deploymentButtonWidget button').click();
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
    });
});
