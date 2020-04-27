describe('Deployments - Create new deployment modal', () => {
    const resourcePrefix = 'deploy_test_';
    const testBlueprintId = `${resourcePrefix}bp`;
    const testBlueprintUrl =
        'https://github.com/cloudify-community/blueprint-examples/releases/download/5.0.5-42/simple-hello-world-example.zip';

    const checkDeployBlueprintModal = () => {
        cy.get('div.deployBlueprintModal').should('be.visible');
        cy.get('.actions > .ui:nth-child(1)').should('have.text', 'Cancel');
        cy.get('.actions > .ui:nth-child(2)').should('have.text', 'Deploy');
        cy.get('.actions > .ui:nth-child(3)').should('have.text', 'Deploy & Install');

        cy.get('.actions > .ui:nth-child(1)').click();
        cy.get('div.deployBlueprintModal').should('not.be.visible');
    };

    const searchTestBlueprintsInBlueprintsWidget = () => {
        cy.server();
        cy.route(/console\/sp\/\?su=\/summary/).as('getSummary');
        cy.route(/console\/sp\/\?su=\/blueprints/).as('getBlueprints');
        cy.get('.blueprintsTable div.input input')
            .clear()
            .type(resourcePrefix)
            .blur();
        cy.wait('@getBlueprints');
        cy.wait('@getSummary');
    };

    const deployBlueprint = (deploymentName, install = false) => {
        const deployTimeout = 5000;
        const deployAndInstallTimeout = 3 * deployTimeout;

        cy.get('div.deployBlueprintModal').within(() => {
            cy.get('div[name="blueprintName"]')
                .click()
                .within(() => {
                    cy.get('input').type(resourcePrefix);
                    cy.get(`div[option-value=${testBlueprintId}]`).click();
                });

            cy.get('input[name="deploymentName"]')
                .click()
                .type(deploymentName);

            cy.get(`.actions > .ui:nth-child(${install ? '3' : '2'})`).click();
        });

        if (install) {
            cy.get('div.executeWorkflowModal').within(() => {
                cy.get('.actions > .ui:nth-child(2)')
                    .as('executeButton')
                    .click();
            });
        }

        cy.get('div.deployBlueprintModal div.ui.text.loader').as('loader');
        cy.get('@loader').should('be.visible');
        cy.get('@loader', { timeout: install ? deployAndInstallTimeout : deployTimeout }).should('not.be.visible');
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

    before(() => {
        cy.activate('valid_spire_license').login();

        cy.deleteDeployments(resourcePrefix, true)
            .deleteBlueprints(resourcePrefix, true)
            .uploadBlueprint(testBlueprintUrl, testBlueprintId);
    });

    it('is available in Dashboard page in Create Deployment Button widget ', () => {
        cy.get('div.dashboardPageMenuItem').click();
        cy.get('div.deploymentButtonWidget button').click();

        checkDeployBlueprintModal();
    });

    it('is available in Blueprint page in Blueprint Action Buttons widget', () => {
        cy.get('div.local_blueprintsPageMenuItem').click();
        searchTestBlueprintsInBlueprintsWidget();
        cy.get(`tr#blueprintsTable_${testBlueprintId} td a`).click();
        cy.get('button#createDeploymentButton').click();

        checkDeployBlueprintModal();
    });

    it('is available in Local Blueprints page in Blueprints widget', () => {
        cy.get('div.local_blueprintsPageMenuItem').click();
        searchTestBlueprintsInBlueprintsWidget();
        cy.get(`tr#blueprintsTable_${testBlueprintId} i.icon.link.rocket`).click();

        checkDeployBlueprintModal();
    });

    it('allows to deploy a blueprint', () => {
        cy.get('div.dashboardPageMenuItem').click();
        cy.get('div.deploymentButtonWidget button').click();
        const deploymentNameWithoutInstall = `${resourcePrefix}DBbutton_deploy`;
        deployBlueprint(deploymentNameWithoutInstall, false);
        verifyBlueprintDeployed(testBlueprintId, deploymentNameWithoutInstall);
    });

    it('allows to deploy and install a blueprint', () => {
        cy.get('div.dashboardPageMenuItem').click();
        cy.get('div.deploymentButtonWidget button').click();
        const deploymentNameWithInstall = `${resourcePrefix}DBbutton_deployAndInstall`;
        deployBlueprint(deploymentNameWithInstall, true);
        verifyBlueprintDeployed(testBlueprintId, deploymentNameWithInstall);
        verifyDeploymentInstallStarted(deploymentNameWithInstall);
    });
});
